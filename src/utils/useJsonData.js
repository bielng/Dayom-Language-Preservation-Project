import { useEffect, useState } from "react";
import { isSupabaseCorpusEnabled } from "../services/supabase.js";
import { isKnownCorpusUrl, fetchCorpusFromSupabase } from "../services/corpusSource.js";

const cache = new Map();
// url -> in-flight promise, rather than a plain boolean/Set. This matters
// under React StrictMode (see main.jsx), which intentionally mounts every
// component twice in development: the second effect invocation for the
// same url needs to attach its own listener to the SAME promise the first
// invocation kicked off, or it silently never learns the load finished and
// gets stuck showing a loading state forever, even after the data is
// sitting in `cache`.
const inFlight = new Map();
const errors = new Map();

function load(url) {
  // When the corpus has been migrated to Supabase (see
  // docs/CONTRIBUTE_DATA_SETUP.md), source these specific URLs from there
  // instead of the static file — same cache key, same shape, so every
  // consumer of this hook is unaffected either way.
  const request =
    isSupabaseCorpusEnabled && isKnownCorpusUrl(url)
      ? fetchCorpusFromSupabase(url)
      : fetch(url).then((res) => {
          if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
          return url.endsWith(".md") ? res.text() : res.json();
        });

  const promise = request
    .then((data) => {
      cache.set(url, data);
    })
    .catch((err) => {
      errors.set(url, err.message);
    })
    .finally(() => {
      inFlight.delete(url);
    });

  inFlight.set(url, promise);
  return promise;
}

/**
 * Fetches a static asset from /public (JSON or Markdown) once, caches it in
 * memory, and only fires when `active` is true — so a tab's dataset only
 * loads the first time that tab is opened, keeping the initial page (and
 * the single-file production build) light.
 */
export function useJsonData(url, { active = true } = {}) {
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (!active || !url || cache.has(url)) return;
    let cancelled = false;
    // Reuse an already-running load for this url if one exists (this is
    // what makes a second StrictMode invocation, or a second component
    // requesting the same url, get notified instead of hanging).
    const promise = inFlight.get(url) || load(url);
    promise.then(() => {
      if (!cancelled) forceRender((n) => n + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [url, active]);

  if (url && cache.has(url)) {
    return { status: "ready", data: cache.get(url), error: null };
  }
  if (url && errors.has(url)) {
    return { status: "error", data: null, error: errors.get(url) };
  }
  if (active && url && inFlight.has(url)) {
    return { status: "loading", data: null, error: null };
  }
  return { status: "idle", data: null, error: null };
}
