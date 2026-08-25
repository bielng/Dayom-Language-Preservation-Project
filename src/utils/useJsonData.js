import { useEffect, useState } from "react";

const cache = new Map();
const loading = new Set();
const errors = new Map();

function load(url) {
  loading.add(url);
  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
      return url.endsWith(".md") ? res.text() : res.json();
    })
    .then((data) => {
      cache.set(url, data);
    })
    .catch((err) => {
      errors.set(url, err.message);
    })
    .finally(() => {
      loading.delete(url);
    });
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
    if (!active || !url || cache.has(url) || loading.has(url)) return;
    let cancelled = false;
    const promise = load(url);
    // Defer so this isn't a synchronous setState-in-effect; it also lets
    // the "loading" flag above be visible on the very next paint.
    queueMicrotask(() => {
      if (!cancelled) forceRender((n) => n + 1);
    });
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
  if (active && url && loading.has(url)) {
    return { status: "loading", data: null, error: null };
  }
  return { status: "idle", data: null, error: null };
}
