import { useRef, useState } from "react";
import PageShell, { Section } from "./PageShell.jsx";
import NuerKeyboard from "../phrasebook/NuerKeyboard.jsx";
import {
  Keyboard,
  Sparkle,
  Send,
  Check,
  AlertCircle,
  Users,
  Heart,
  RotateCcw,
} from "../Icons.jsx";
import {
  previewAutoTranslation,
  submitContribution,
} from "../../services/contributions.js";
import { isSupabaseConfigured } from "../../services/supabase.js";

const MODES = [
  {
    id: "new",
    label: "Add a new pair",
    blurb:
      "You know an English sentence and its correct Thok Naath translation.",
  },
  {
    id: "correction",
    label: "Correct a bad translation",
    blurb: "Google Translate or our own auto-translator got a sentence wrong.",
  },
];

const EMPTY_FORM = {
  englishText: "",
  autoTranslation: "",
  nuerText: "",
  dialect: "",
  notes: "",
  contributorName: "",
  contributorEmail: "",
};

export default function ContributeDataPage() {
  const [mode, setMode] = useState("new");
  const [form, setForm] = useState(EMPTY_FORM);
  const [isNativeSpeaker, setIsNativeSpeaker] = useState(false);
  const [creditContributor, setCreditContributor] = useState(true);

  // Bot defenses, mirrored server-side in supabase/functions/submit-contribution:
  // "website" is a honeypot a real visitor never sees or fills; formOpenedAt
  // lets the server reject submissions that arrive faster than a human could
  // plausibly type a sentence. Neither is user-facing, so they live outside
  // the visible `form` state above.
  const [website, setWebsite] = useState("");
  const [formOpenedAt, setFormOpenedAt] = useState(() => Date.now());

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [checkingMt, setCheckingMt] = useState(false);
  const [mtChecked, setMtChecked] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const nuerRef = useRef(null);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const canSubmit =
    form.englishText.trim().length > 2 &&
    form.nuerText.trim().length > 1 &&
    isNativeSpeaker &&
    !submitting;

  const handleCheckAuto = async () => {
    if (!form.englishText.trim()) return;
    setCheckingMt(true);
    setMtChecked(false);
    const result = await previewAutoTranslation(form.englishText);
    setForm((f) => ({
      ...f,
      autoTranslation: result?.text || f.autoTranslation,
    }));
    setMtChecked(true);
    setCheckingMt(false);
  };

  // --- Nuer textarea + virtual keyboard wiring (same pattern as the
  // Phrasebook page's on-screen Thok Naath keyboard) ---
  const insertAtCursor = (text) => {
    const el = nuerRef.current;
    const start = el?.selectionStart ?? form.nuerText.length;
    const end = el?.selectionEnd ?? form.nuerText.length;
    const next =
      form.nuerText.slice(0, start) + text + form.nuerText.slice(end);
    setForm((f) => ({ ...f, nuerText: next }));
    requestAnimationFrame(() => {
      el?.focus();
      const pos = start + text.length;
      el?.setSelectionRange(pos, pos);
    });
  };

  const handleBackspace = () => {
    const el = nuerRef.current;
    const start = el?.selectionStart ?? form.nuerText.length;
    const end = el?.selectionEnd ?? form.nuerText.length;
    if (start !== end) {
      setForm((f) => ({
        ...f,
        nuerText: f.nuerText.slice(0, start) + f.nuerText.slice(end),
      }));
    } else if (start > 0) {
      setForm((f) => ({
        ...f,
        nuerText: f.nuerText.slice(0, start - 1) + f.nuerText.slice(start),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitContribution({
        englishText: form.englishText,
        nuerText: form.nuerText,
        isCorrection: mode === "correction",
        autoTranslation: mode === "correction" ? form.autoTranslation : "",
        dialect: form.dialect,
        notes: form.notes,
        contributorName: form.contributorName,
        contributorEmail: form.contributorEmail,
        isNativeSpeaker,
        creditContributor,
        formOpenedAt,
        website,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err?.message || "Something went wrong sending that — please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForNext = () => {
    setForm(EMPTY_FORM);
    setMtChecked(false);
    setShowKeyboard(false);
    setSubmitted(false);
    setSubmitError("");
    setWebsite("");
    setFormOpenedAt(Date.now());
  };

  if (submitted) {
    return (
      <PageShell
        eyebrow='Thank You'
        title='Ci̱ lɔcdä tɛɛth ɛlɔ̱ŋ kɛ luäkdu - your pair has been received'
        lede='It now sits in the native-speaker review queue described on the Contribute page. Once a reviewer confirms it, it joins the open corpus and helps every model trained on it.'
      >
        <div className='card p-8 sm:p-10 text-center max-w-xl mx-auto animate-fade-in'>
          <div className='h-14 w-14 rounded-full bg-amber-300 text-ink-900 flex items-center justify-center mx-auto mb-5'>
            <Heart />
          </div>
          <h2 className='text-xl font-bold text-ink-900'>
            Thank you for helping preserve Thok Naath
          </h2>
          <p className='mt-3 text-sm text-ink-500 leading-relaxed'>
            Every high-quality pair from a native speaker makes the next
            translation model less likely to guess. This one is now queued for
            review alongside everyone else's.
          </p>
          <div className='mt-7 flex items-center justify-center gap-3 flex-wrap'>
            <button onClick={resetForNext} className='btn-primary'>
              <Sparkle /> Submit another pair
            </button>
            <a href='/contribute' className='btn-ghost'>
              Back to Contribute
            </a>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow='Crowdsource The Corpus'
      title='Submit an English → Nuer pair'
      lede='A volunteer, native-speaker-sourced dataset of English–Thok Naath pairs, used to correct and improve machine translation. If Google Translate or our own auto-translator gets a sentence wrong, this is where you fix it.'
    >
      {!isSupabaseConfigured && (
        <div className='card p-4 mb-8 border-amber-300 bg-amber-300/15 flex items-start gap-3'>
          <span className='mt-0.5 text-ink-900 shrink-0'>
            <AlertCircle />
          </span>
          <p className='text-sm text-ink-700 leading-relaxed'>
            Submissions aren't connected to a database on this deploy yet. Set{" "}
            <code className='font-mono text-[13px]'>VITE_SUPABASE_URL</code> and{" "}
            <code className='font-mono text-[13px]'>
              VITE_SUPABASE_ANON_KEY
            </code>{" "}
            — see{" "}
            <code className='font-mono text-[13px]'>
              docs/CONTRIBUTE_DATA_SETUP.md
            </code>
            .
          </p>
        </div>
      )}

      <Section
        eyebrow='Step 1'
        title='What kind of contribution is this?'
        className='mb-10'
      >
        <div className='grid sm:grid-cols-2 gap-4'>
          {MODES.map((m) => (
            <button
              key={m.id}
              type='button'
              onClick={() => setMode(m.id)}
              className={`card p-5 text-left transition ${
                mode === m.id
                  ? "border-amber-400 bg-amber-300/10 ring-1 ring-amber-400"
                  : "hover:border-ink-300"
              }`}
            >
              <h3 className='font-semibold text-ink-900'>{m.label}</h3>
              <p className='mt-1.5 text-sm text-ink-500 leading-relaxed'>
                {m.blurb}
              </p>
            </button>
          ))}
        </div>
      </Section>

      <form onSubmit={handleSubmit}>
        {/* Honeypot: real visitors never see this (off-screen + aria-hidden +
            tabIndex -1 + no autofill), so anything filling it in is a bot. */}
        <input
          type='text'
          name='website'
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete='off'
          aria-hidden='true'
          style={{
            position: "absolute",
            left: "-9999px",
            width: 1,
            height: 1,
            opacity: 0,
          }}
        />
        <Section eyebrow='Step 2' title='The sentence pair' className='mb-10'>
          <div className='card p-6 sm:p-8 space-y-6'>
            <div>
              <label className='text-sm font-semibold text-ink-900'>
                English sentence
              </label>
              <textarea
                required
                rows={2}
                value={form.englishText}
                onChange={update("englishText")}
                placeholder='e.g. The cattle are grazing near the river.'
                className='mt-2 w-full bg-cream-50 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400 resize-none'
              />
            </div>

            {mode === "correction" && (
              <div>
                <div className='flex items-center justify-between gap-3 flex-wrap'>
                  <label className='text-sm font-semibold text-ink-900'>
                    What Google Translate / our auto-translator produced
                  </label>
                  <button
                    type='button'
                    onClick={handleCheckAuto}
                    disabled={!form.englishText.trim() || checkingMt}
                    className='btn-ghost !py-1.5 !px-3 text-xs disabled:opacity-40'
                  >
                    {checkingMt ? (
                      <>
                        <RotateCcw className='animate-spin' /> Checking…
                      </>
                    ) : (
                      <>
                        <Sparkle /> Check current auto-translation
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={form.autoTranslation}
                  onChange={update("autoTranslation")}
                  placeholder='Paste what Google Translate gave you, or tap “Check current auto-translation” above'
                  className='mt-2 w-full bg-cream-50 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400 resize-none'
                />
                {mtChecked && !form.autoTranslation && (
                  <p className='mt-1.5 text-xs text-ink-400'>
                    Couldn't reach the auto-translator right now — you can still
                    paste a result manually, or just submit your corrected pair
                    below.
                  </p>
                )}
              </div>
            )}

            <div>
              <div className='flex items-center justify-between gap-3 flex-wrap'>
                <label className='text-sm font-semibold text-ink-900'>
                  {mode === "correction"
                    ? "Correct Nuer translation"
                    : "Nuer (Thok Naath) translation"}
                </label>
                <button
                  type='button'
                  onClick={() => setShowKeyboard((v) => !v)}
                  className={`shrink-0 p-2 rounded-full border transition-all ${
                    showKeyboard
                      ? "bg-amber-300 border-amber-300 text-ink-900"
                      : "bg-white border-ink-200 text-ink-600 hover:bg-cream-100"
                  }`}
                  title='Thok Naath keyboard'
                >
                  <Keyboard />
                </button>
              </div>
              <textarea
                ref={nuerRef}
                required
                rows={2}
                value={form.nuerText}
                onChange={update("nuerText")}
                placeholder='Kä ɣɔ̱k guɛrkɛ gekä yiëër.'
                className='mt-2 w-full bg-cream-50 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400 resize-none'
              />
              {showKeyboard && (
                <div className='mt-2'>
                  <NuerKeyboard
                    onKeyPress={insertAtCursor}
                    onBackspace={handleBackspace}
                    onSpace={() => insertAtCursor(" ")}
                    onClose={() => setShowKeyboard(false)}
                  />
                </div>
              )}
            </div>

            <div className='grid sm:grid-cols-2 gap-6'>
              <div>
                <label className='text-sm font-semibold text-ink-900'>
                  Dialect (optional)
                </label>
                <input
                  type='text'
                  value={form.dialect}
                  onChange={update("dialect")}
                  placeholder='e.g. Bul, Jikany, Lou, Thiang…'
                  className='mt-2 w-full bg-cream-50 rounded-xl px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400'
                />
              </div>
              <div>
                <label className='text-sm font-semibold text-ink-900'>
                  Notes for the reviewer (optional)
                </label>
                <input
                  type='text'
                  value={form.notes}
                  onChange={update("notes")}
                  placeholder='Context, why the auto-translation was wrong, tone markings…'
                  className='mt-2 w-full bg-cream-50 rounded-xl px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400'
                />
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow='Step 3' title='About you' className='mb-10'>
          <div className='card p-6 sm:p-8 space-y-5'>
            <label className='flex items-start gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={isNativeSpeaker}
                onChange={(e) => setIsNativeSpeaker(e.target.checked)}
                className='mt-0.5 h-4 w-4 accent-amber-400'
              />
              <span className='text-sm text-ink-700 leading-relaxed'>
                <span className='font-semibold text-ink-900'>
                  I am a native Nuer (Thok Naath) speaker
                </span>{" "}
                — this is required, because a translation project run without
                its speakers produces confident, fluent, wrong output.
              </span>
            </label>

            <div className='grid sm:grid-cols-2 gap-6'>
              <div>
                <label className='text-sm font-semibold text-ink-900'>
                  Your name (optional)
                </label>
                <input
                  type='text'
                  value={form.contributorName}
                  onChange={update("contributorName")}
                  placeholder="How you'd like to be credited"
                  className='mt-2 w-full bg-cream-50 rounded-xl px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400'
                />
              </div>
              <div>
                <label className='text-sm font-semibold text-ink-900'>
                  Email (optional)
                </label>
                <input
                  type='email'
                  value={form.contributorEmail}
                  onChange={update("contributorEmail")}
                  placeholder='In case a reviewer has a question'
                  className='mt-2 w-full bg-cream-50 rounded-xl px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 border border-ink-200 outline-none focus:border-ink-400'
                />
              </div>
            </div>

            <label className='flex items-start gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={creditContributor}
                onChange={(e) => setCreditContributor(e.target.checked)}
                className='mt-0.5 h-4 w-4 accent-amber-400'
              />
              <span className='text-sm text-ink-700 leading-relaxed'>
                Credit me by name on this entry. Uncheck to contribute
                anonymously — either way, the pair stays in the open corpus.
              </span>
            </label>
          </div>
        </Section>

        {submitError && (
          <div className='card p-4 mb-6 border-red-200 bg-red-50 flex items-start gap-3'>
            <span className='mt-0.5 text-red-600 shrink-0'>
              <AlertCircle />
            </span>
            <p className='text-sm text-red-700 leading-relaxed'>
              {submitError}
            </p>
          </div>
        )}

        <div className='flex items-center gap-4 flex-wrap'>
          <button
            type='submit'
            disabled={!canSubmit}
            className='btn-primary disabled:opacity-40'
          >
            {submitting ? (
              <>
                <RotateCcw className='animate-spin' /> Submitting…
              </>
            ) : (
              <>
                <Send /> Submit pair
              </>
            )}
          </button>
          <span className='inline-flex items-center gap-1.5 text-xs text-ink-400'>
            <Users /> Reviewed by a native speaker before it joins the corpus
          </span>
        </div>
      </form>
    </PageShell>
  );
}
