import { useRegisterSW } from "virtual:pwa-register/react";

const HOUR = 60 * 60 * 1000;

// A new version is installed in the background and waits: the table lives in memory,
// so the page only reloads when the person says so.
const UpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Installed apps stay open for days; look for a new version every hour.
      if (registration) setInterval(() => registration.update(), HOUR);
    },
  });

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      className="pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[18px] bg-panel p-4 text-ground shadow-[0_12px_32px_-12px_rgba(35,25,15,0.5)]"
    >
      <p className="min-w-0 flex-1 basis-56 text-[15px]">
        Hay una versión nueva. Al actualizar se reinicia la mesa: guardala primero si la necesitás.
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
