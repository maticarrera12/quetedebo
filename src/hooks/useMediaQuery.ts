import { useCallback, useSyncExternalStore } from "react";

export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
};

// Below Tailwind's `sm`: the phone gets its own shell (bottom bar, sheet), the rest keeps the page.
export const useIsMobile = (): boolean => useMediaQuery("(max-width: 639px)");
