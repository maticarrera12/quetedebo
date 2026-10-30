import { useSyncExternalStore } from "react";
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

  return {
    mode,
    bannerVisible: mode !== null && !state.dismissed,
    install: promptInstall,
    dismiss: dismissBanner,
    reopen: reopenBanner,
  };
};
