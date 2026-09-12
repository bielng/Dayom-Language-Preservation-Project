# Supabase setup — crowdsource form + full corpus hosting

This deploy can run in two independent modes, both backed by the same
Supabase project:

1. **Contribution form only** — `/contribute/submit` writes to Supabase via
   a hardened Edge Function. The Library, Dinka Library, and Phrasebook keep
   reading from the static files in `public/data` / `public/audio`.
2. **Everything on Supabase** — the corpus tables and the phrasebook audio
   are migrated into the same project, and every page reads from there
   instead of static files.

Turn on (1) by setting two env vars. Turn on (2) after that, by running one
script and flipping one more flag. Nothing forces you into mode 2 — mode 1
is fully functional on its own.

## Files this setup touches

| File | Purpose |
| --- | --- |
| `supabase/schema.sql` | Every table, RLS policy, and Storage bucket policy — run once |
| `supabase/functions/submit-contribution/index.ts` | Edge Function — the only thing allowed to write a contribution |
| `scripts/seed-corpus.mjs` | One-time migration of `public/data/*` + `public/audio/*` into Supabase |
| `src/services/supabase.js` | Client + two feature flags (`isSupabaseConfigured`, `isSupabaseCorpusEnabled`) |
| `src/services/contributions.js` | Calls the Edge Function — never talks to the table directly |
| `src/services/corpusSource.js` | Reassembles Supabase rows into the exact JSON shapes the Library pages already expect |
| `src/services/mediaSource.js` | Resolves phrasebook audio URLs to Supabase Storage when corpus hosting is on |
| `src/utils/useJsonData.js` | Single integration point — routes to Supabase or static files by URL |
| `src/components/phrasebook/useAudioPlayer.js` | Single integration point for audio playback |

## The security model, in one paragraph

The browser only ever holds the public **anon** key. That key can `SELECT`
from the nine corpus tables and nothing else — no insert, update, or
delete, on any table, enforced twice (Row Level Security policies *and*
explicit `REVOKE`/`GRANT` statements, so a stray future policy can't quietly
open a hole). It has **zero** privileges on `translation_contributions` —
not even `SELECT`. The only way a contribution is written is through the
`submit-contribution` Edge Function, which runs the **service_role** key —
the one credential that bypasses RLS — entirely on Supabase's servers,
never in the browser. That function validates every field, strips HTML,
enforces length limits, checks a honeypot field and a submission-timing
window, and rate-limits by IP before it writes anything, and a
database-level trigger enforces the same rate limit again as a backstop.

## One-time setup

1. **Create a project** at [supabase.com](https://supabase.com) (free tier
   is enough for this).
2. **Run the schema.** Project → SQL Editor → New query → paste the full
   contents of `supabase/schema.sql` → Run. This creates all nine corpus
   tables, `translation_contributions`, the rate-limit trigger, and the
   `phrasebook-audio` Storage bucket with its read-only policy. Safe to
   re-run if you tweak it later.
3. **Get your keys.** Project → Settings → API:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → keep this one out of Vercel entirely, see step 6
4. **Set the two frontend env vars in Vercel.** Project → Settings →
   Environment Variables → add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` for Production (and Preview, if you want
   preview deploys to work too) → redeploy (Vercel only bakes env vars in
   at build time, so a redeploy is required after adding them). For local
   dev, copy `.env.example` to `.env` and fill in the same two values.
5. **Install the Supabase CLI** if you don't have it (`npm i -g
   supabase`), then from the repo root:
   ```
   supabase login
   supabase link --project-ref your-project-ref
   supabase functions deploy submit-contribution
   supabase secrets set ALLOWED_ORIGIN=https://dayom.org,https://www.dayom.org
   ```
   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected into every
   Edge Function automatically by Supabase — you don't set those yourself.
   Update `ALLOWED_ORIGIN` to match your actual Vercel domain(s); this is
   what stops other sites from embedding a form that posts to your
   function.
6. **Test it.** Open `/contribute/submit` on your deploy, submit a pair,
   and check Table Editor → `translation_contributions` in Supabase for the
   new row with `status = pending`.

At this point mode 1 (contribution form) is fully live. Stop here if that's
all you want.

## Migrating the full corpus (mode 2)

7. **Run the seed script from your own machine** (never from Vercel — it
   needs the service_role key, which must never touch a Vercel env var):
   ```
   SUPABASE_URL=https://your-project-ref.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
   npm run seed:supabase
   ```
   This clears and repopulates all nine corpus tables from
   `public/data/**`, uploads all 546 clips from `public/audio` into the
   `phrasebook-audio` Storage bucket (resumable — already-uploaded files
   are skipped on a re-run), and upserts the grammar guide's Markdown into
   `content_pages`. Pass `--skip-audio` to only refresh the text data.
8. **Flip the switch.** Set `VITE_SUPABASE_CORPUS=true` in Vercel's
   environment variables alongside the other two, and redeploy. The
   Library, Dinka Library, and Phrasebook pages — and every pronunciation
   clip — now come from Supabase. `public/data` and `public/audio` stay in
   the repo as a fallback: unset the flag (or if the two Supabase vars are
   ever missing) and the site quietly falls back to serving them directly.

## Reviewing submissions

Submissions land with `status = 'pending'`. From Supabase's Table editor,
filter `translation_contributions` by that status, and flip it to
`'approved'` once a native speaker has confirmed the pair (or `'rejected'`
otherwise). Approved rows are the ones to fold into `nuer_dictionary` /
`nuer_phrasebook` / etc. on your next corpus refresh — either by hand in
the Table editor, or by writing a small script that copies approved rows
across (the `status` column and the review step already match the
"native-speaker review" step described on `/contribute`).

## If something looks wrong

- **Library pages show nothing after setting `VITE_SUPABASE_CORPUS=true`**
  — the seed script probably hasn't finished, or a table came back empty.
  Check Table Editor row counts against the numbers in `scripts/seed-corpus.mjs`'s
  output. Unset the flag to fall back to static files while you debug.
- **Submissions return "Submissions aren't connected yet"** —
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` aren't set on this deploy,
  or you forgot to redeploy after adding them.
- **Submissions fail with a generic error** — the Edge Function likely
  isn't deployed yet (`supabase functions deploy submit-contribution`), or
  `ALLOWED_ORIGIN` doesn't include the exact origin you're testing from
  (check the browser's network tab for a CORS error specifically).
- **A legitimate contributor gets rate-limited** — the limit is 20
  submissions per IP per hour (`RATE_LIMIT_PER_HOUR` in the Edge Function,
  mirrored in the database trigger in `schema.sql`); raise both numbers if
  that's too tight for your use case.
