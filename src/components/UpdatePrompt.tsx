import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { detectStandalone } from "../utils/install";

const HOUR = 60 * 60 * 1000;

// A new version never reloads the page under someone who is typing.
// - Installed app: it waits and the person decides when, through this notice.
// - Browser tab: it takes over silently and shows up on the next reload or visit, like any
//   website. A module this tab still needs from the old version is handled by staleChunk.ts.
const UpdatePrompt = () => {
  const [standalone] = useState<boolean>(detectStandalone);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Installed apps stay open for days; look for a new version every hour.
      if (registration) setInterval(() => registration.update(), HOUR);
    },
    // Called when the new version takes control. Only the installed app, where the person
    // asked for it, reloads; a browser tab keeps running until it is reloaded.
    onNeedReload() {
      if (detectStandalone()) window.location.reload();
    },
  });

  useEffect(() => {
    if (!needRefresh || standalone) return;

    setNeedRefresh(false);
    void updateServiceWorker();
  }, [needRefresh, standalone, setNeedRefresh, updateServiceWorker]);

  if (!needRefresh || !standalone) return null;

  return (
    <div
      role="status"
      className="pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[18px] bg-panel p-4 text-ground"
    >
      <p className="min-w-0 flex-1 basis-56 text-[15px]">
        Hay una versión nueva. Actualizá cuando quieras: tu mesa se mantiene.
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="rounded-full border-[1.5px] border-muted px-4 py-2 text-sm font-bold text-ground transition-colors duration-150 hover:border-ground"
        >
          Después
        </button>

        <button
          type="button"
          onClick={() => updateServiceWorker(true)}
          className="rounded-full bg-honey px-4 py-2 text-sm font-bold text-ink transition-colors duration-150 hover:bg-honey-soft"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
};

export default UpdatePrompt;
