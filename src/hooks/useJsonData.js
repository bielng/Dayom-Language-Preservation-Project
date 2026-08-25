import { useState, useEffect } from "react";

const cache = new Map();

/**
 * Lazy fetch JSON/Markdown with in-memory cache
 * @param {string} url
 * @returns {{ data: any, loading: boolean, error: string|null }}
 */
export default function useJsonData(url) {
  const [data, setData] = useState(cache.get(url) || null);
  const [loading, setLoading] = useState(!cache.has(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache.has(url)) {
      setData(cache.get(url));
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) return res.json();
        return res.text();
      })
      .then((payload) => {
        if (!cancelled) {
          cache.set(url, payload);
          setData(payload);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load data");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
