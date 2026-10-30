import { useSyncExternalStore } from "react";
import { useIsMobile } from "./useMediaQuery";
import {
  computeInstallMode,
  dismissBanner,
  getSnapshot,
  promptInstall,
  reopenBanner,
  subscribe,
} from "../utils/install";
import type { InstallMode } from "../utils/install";

interface UseInstall {
  mode: InstallMode;
  bannerVisible: boolean;
  install: () => Promise<void>;
  dismiss: () => void;
  reopen: () => void;
}

export const useInstall = (): UseInstall => {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const mode = computeInstallMode(state);
  const isMobile = useIsMobile();

  return {
    mode,
    // On a computer the browser already shows its own install icon; the banner is for phones,
    // and for iOS, where nothing else tells people how to install.
    bannerVisible: mode !== null && !state.dismissed && (isMobile || mode === "ios"),
    install: promptInstall,
    dismiss: dismissBanner,
    reopen: reopenBanner,
  };
};
