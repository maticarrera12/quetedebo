// A browser tab keeps running the code it loaded, but a new deploy (and a new service worker)
// removes the old files. When that tab later loads a module on demand (the Supabase client, for
// example) the file is gone and the import fails. Reloading picks up the current version.

const RELOAD_MARK_KEY = "quetedebo:stale-chunk-reload";
const MIN_RELOAD_GAP_MS = 30_000;

// Reload unless we already did so moments ago: if the file is missing for another reason, a
// reload would not fix it and the page would loop.
export const shouldReloadForStaleChunk = (lastReloadMark: string | null, now: number): boolean => {
  const last = Number(lastReloadMark);
  return !Number.isFinite(last) || lastReloadMark === null || now - last >= MIN_RELOAD_GAP_MS;
};

export const startStaleChunkReload = (): void => {
  window.addEventListener("vite:preloadError", (event) => {
    let mark: string | null = null;

    try {
      mark = sessionStorage.getItem(RELOAD_MARK_KEY);
    } catch {
      // Storage blocked: still reload once; without the mark a loop is possible but unlikely.
    }

    if (!shouldReloadForStaleChunk(mark, Date.now())) return;

    // Handled here: the failed import is not reported as an error, the page reloads instead.
    event.preventDefault();

    try {
      sessionStorage.setItem(RELOAD_MARK_KEY, String(Date.now()));
    } catch {
      // Nothing to remember it in; reload anyway.
    }

    window.location.reload();
  });
};
