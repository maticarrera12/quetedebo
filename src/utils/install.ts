// Install state for the PWA. It lives outside React because `beforeinstallprompt` can fire
// before the first render, and an event nobody was listening to is lost for good.

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface InstallState {
  deferred: BeforeInstallPromptEvent | null;
  installed: boolean;
  dismissed: boolean;
  ios: boolean;
  standalone: boolean;
}

// native: the browser can show its install dialog. ios: Safari has no such dialog, so we explain.
export type InstallMode = "native" | "ios" | null;

const DISMISS_KEY = "quetedebo:install-dismissed";

export const isIos = (userAgent: string, maxTouchPoints: number): boolean =>
  /iPad|iPhone|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1);

export const computeInstallMode = (
  state: Pick<InstallState, "deferred" | "installed" | "ios" | "standalone">
): InstallMode => {
  if (state.standalone || state.installed) return null;
  if (state.deferred) return "native";
  return state.ios ? "ios" : null;
};

const readDismissed = (): boolean => {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
};

const detectStandalone = (): boolean =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

let state: InstallState = {
  deferred: null,
  installed: false,
  dismissed: false,
  ios: false,
  standalone: false,
};

const listeners = new Set<() => void>();

const update = (patch: Partial<InstallState>) => {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getSnapshot = () => state;

let started = false;

export const startInstallListeners = () => {
  if (started || typeof window === "undefined") return;
  started = true;

  state = {
    ...state,
    dismissed: readDismissed(),
    ios: isIos(navigator.userAgent, navigator.maxTouchPoints),
    standalone: detectStandalone(),
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    // We show our own button, so the browser's own mini prompt would only compete with it.
    event.preventDefault();
    update({ deferred: event as BeforeInstallPromptEvent });
  });

  window.addEventListener("appinstalled", () => update({ installed: true, deferred: null }));
};

export const promptInstall = async () => {
  const event = state.deferred;
  if (!event) return;

  // The event can be used only once; the browser fires a new one if it is still installable.
  update({ deferred: null });
  await event.prompt();

  const { outcome } = await event.userChoice;
  if (outcome === "accepted") update({ installed: true });
};

export const dismissBanner = () => {
  try {
    localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // Private mode: the banner simply comes back next visit.
  }
  update({ dismissed: true });
};

export const reopenBanner = () => {
  try {
    localStorage.removeItem(DISMISS_KEY);
  } catch {
    // Nothing stored, nothing to clear.
  }
  update({ dismissed: false });
};
