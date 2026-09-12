-- ============================================================================
-- Dayom Lab — full Supabase backend
-- Run once in Supabase Studio → SQL Editor → New query → paste → Run.
-- Safe to re-run: everything uses IF NOT EXISTS / OR REPLACE / DROP ... IF
-- EXISTS, so re-running this file after a schema tweak won't error out or
-- duplicate policies.
--
-- Two families of tables, two very different trust levels:
--
--   1. CORPUS tables (dictionary, vocabulary, structures, conversation,
--      grammar, examples, phrasebook, dinka dictionary, grammar guide) —
--      public reference data. Anyone can SELECT. Nobody using the public
--      anon key can INSERT/UPDATE/DELETE a single row — only a script
--      run with the service_role key (scripts/seed-corpus.mjs) can write,
--      and that key never ships to the browser.
--
--   2. translation_contributions — the crowdsource inbox. The anon key
--      (used by the browser) gets ZERO direct privileges on this table,
--      by policy AND by grant. Writes only happen through the
--      `submit-contribution` Edge Function (supabase/functions/), which
--      validates, sanitizes, and rate-limits server-side before writing
--      with the service_role key. This means even someone who reads the
--      anon key out of the deployed JS bundle cannot write to this table
--      directly via the REST API — the browser never has write access,
--      period.
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- 1. CORPUS TABLES — public read-only reference data
-- ============================================================================

create table if not exists public.nuer_dictionary (
  id             text primary key,
  english        text not null,
  nuer           text not null,
  part_of_speech text,
  alternatives   jsonb not null default '[]'::jsonb,
  examples       jsonb not null default '[]'::jsonb,
  source         text
);

create table if not exists public.nuer_vocabulary (
  id           bigserial primary key,
  topic_number text,
  topic_title  text,
  category     text,
  row_number   text,
  nuer         text not null,
  english      text not null,
  source       text,
  license      text,
  url          text
);

create table if not exists public.nuer_structures (
  id           bigserial primary key,
  topic_number text,
  topic_title  text,
  category     text,
  row_number   text,
  nuer         text not null,
  english      text not null,
  source       text,
  license      text,
  url          text
);

create table if not exists public.nuer_conversation (
  id           bigserial primary key,
  topic_number text,
  topic_title  text,
  category     text,
  row_number   text,
  nuer         text not null,
  english      text not null,
  source       text,
  license      text,
  url          text
);

create table if not exists public.nuer_grammar (
  id           bigserial primary key,
  topic_number text,
  topic_title  text,
  category     text,
  row_number   text,
  nuer         text not null,
  english      text not null,
  source       text,
  license      text,
  url          text
);

create table if not exists public.nuer_examples (
  id       bigserial primary key,
  nuer     text not null,
  english  text not null,
  category text,
  pattern  text
);

create table if not exists public.nuer_phrasebook (
  id             integer primary key,
  nuer           text not null,
  ipa            text,
  part_of_speech text,
  plural_info    text,
  senses         jsonb not null default '[]'::jsonb,
  sense_info     text,
  examples       jsonb not null default '[]'::jsonb,
  audio_files    jsonb not null default '[]'::jsonb,
  dialect        text
);

create table if not exists public.dinka_dictionary (
  id             text primary key,
  dinka          text not null,
  english        text not null,
  part_of_speech text,
  dialect_tags   jsonb not null default '[]'::jsonb,
  example        text
);

-- Long-form prose pages that used to be static Markdown files in
-- public/data (currently just the grammar guide, key = 'grammar-guide').
create table if not exists public.content_pages (
  key        text primary key,
  content    text not null,
  updated_at timestamptz not null default now()
);

-- --- Lock every corpus table down to "anyone can read, nobody can write" ---
do $$
declare
  t text;
begin
  foreach t in array array[
    'nuer_dictionary', 'nuer_vocabulary', 'nuer_structures', 'nuer_conversation',
    'nuer_grammar', 'nuer_examples', 'nuer_phrasebook', 'dinka_dictionary',
    'content_pages'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "Public read access" on public.%I;', t);
    execute format(
      'create policy "Public read access" on public.%I for select to anon, authenticated using (true);',
      t
    );

    -- Belt and braces: explicit grants, independent of the RLS policy above.
    -- Even if a future migration adds a stray write policy by mistake, these
    -- roles still have no table-level privilege to act on it.
    execute format('revoke all on public.%I from anon, authenticated;', t);
    execute format('grant select on public.%I to anon, authenticated;', t);
  end loop;
end $$;

create index if not exists nuer_dictionary_nuer_idx on public.nuer_dictionary (lower(nuer));
create index if not exists nuer_phrasebook_nuer_idx on public.nuer_phrasebook (lower(nuer));
create index if not exists dinka_dictionary_dinka_idx on public.dinka_dictionary (lower(dinka));

-- ============================================================================
-- 2. TRANSLATION_CONTRIBUTIONS — the crowdsource inbox (no public write path)
-- ============================================================================

create table if not exists public.translation_contributions (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),

  -- the pair itself — length-capped so nobody can push a multi-megabyte
  -- payload through this endpoint
  english_text       text not null check (char_length(english_text) between 3 and 2000),
  nuer_text          text not null check (char_length(nuer_text) between 1 and 2000),
  dialect            text check (dialect is null or char_length(dialect) <= 200),
  notes              text check (notes is null or char_length(notes) <= 2000),

  -- "correct a bad translation" mode
  is_correction      boolean not null default false,
  auto_translation   text check (auto_translation is null or char_length(auto_translation) <= 2000),

  -- who submitted it
  contributor_name   text check (contributor_name is null or char_length(contributor_name) <= 200),
  contributor_email  text check (
                        contributor_email is null
                        or (char_length(contributor_email) <= 320
                            and contributor_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
                      ),
  -- required, and enforced server-side even if a client tampers with the
  -- request: a translation project without its speakers is exactly the
  -- failure mode this whole form exists to prevent
  is_native_speaker  boolean not null default false check (is_native_speaker = true),
  credit_contributor boolean not null default true,

  -- review workflow — flipped from the Supabase dashboard by a reviewer,
  -- never from the public API
  status             text not null default 'pending'
                       check (status in ('pending', 'approved', 'rejected')),
  source             text not null default 'web-crowdsource-form',

  -- set by the Edge Function from request metadata, never trusted from the
  -- client-submitted body — used for rate limiting and abuse triage
  ip_address         inet,
  user_agent         text check (user_agent is null or char_length(user_agent) <= 500)
);

comment on table public.translation_contributions is
  'Volunteer English<->Nuer (Thok Naath) pairs submitted via the /contribute/submit crowdsource form, written only by the submit-contribution Edge Function using the service_role key. Reviewed by a native speaker (status column) before being folded into the corpus tables above.';

alter table public.translation_contributions enable row level security;

-- No policies for anon/authenticated at all: with RLS enabled and zero
-- matching policies, every operation is denied by default for those roles.
-- Only service_role (used exclusively inside the Edge Function, and by
-- reviewers via the Supabase dashboard) can touch this table.
drop policy if exists "Anyone can submit a contribution" on public.translation_contributions;

revoke all on public.translation_contributions from anon, authenticated;
-- (No grants at all for anon/authenticated — not even SELECT. If you'd like
-- an anonymous "here's what's already been submitted" view later, build it
-- as a separate view that exposes only non-sensitive, approved columns.)

create index if not exists translation_contributions_ip_created_idx
  on public.translation_contributions (ip_address, created_at);
create index if not exists translation_contributions_status_created_idx
  on public.translation_contributions (status, created_at);

-- Server-side rate limit, enforced atomically inside the same transaction
-- as the insert (closes the race condition a purely application-level check
-- would have). The Edge Function also checks this before inserting so it
-- can return a clean 429 with a friendly message — this trigger is the
-- backstop in case that check is ever bypassed or out of sync.
create or replace function public.enforce_contribution_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count integer;
begin
  if new.ip_address is not null then
    select count(*) into recent_count
    from public.translation_contributions
    where ip_address = new.ip_address
      and created_at > now() - interval '1 hour';

    if recent_count >= 20 then
      raise exception 'Rate limit exceeded: too many submissions from this address in the last hour'
        using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_contribution_rate_limit on public.translation_contributions;
create trigger trg_contribution_rate_limit
  before insert on public.translation_contributions
  for each row execute function public.enforce_contribution_rate_limit();

-- ============================================================================
-- 3. STORAGE — phrasebook pronunciation audio
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('phrasebook-audio', 'phrasebook-audio', true)
on conflict (id) do nothing;

drop policy if exists "Public read access for phrasebook audio" on storage.objects;
create policy "Public read access for phrasebook audio"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'phrasebook-audio');

-- Deliberately no insert/update/delete policy for anon/authenticated here:
-- only the seed script, run locally with the service_role key, can upload
-- or replace audio files. The public site can only ever read them.
