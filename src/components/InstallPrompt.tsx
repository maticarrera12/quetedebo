import { useInstall } from "../hooks/useInstall";

// Chrome and Edge can install straight from a button. Safari on iPhone cannot, so there the
// banner only explains the two taps it takes.
const InstallPrompt = () => {
  const { mode, bannerVisible, install, dismiss } = useInstall();

  if (!bannerVisible) return null;

  const native = mode === "native";

  return (
    <div
      role="region"
      aria-label="Instalar la app"
      className="pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[18px] bg-panel p-4 text-ground shadow-[0_12px_32px_-12px_rgba(35,25,15,0.5)]"
    >
      <p className="min-w-0 flex-1 basis-56 text-[15px]">
        {native
          ? "Instalá ¿Qué te debo? y abrila como una app, incluso sin conexión."
          : "Para instalarla en tu iPhone: tocá Compartir y después “Agregar a inicio”."}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full border-[1.5px] border-muted px-4 py-2 text-sm font-bold text-ground transition-colors duration-150 hover:border-ground"
        >
          {native ? "Ahora no" : "Entendido"}
        </button>

        {native && (
          <button
            type="button"
            onClick={install}
            className="rounded-full bg-honey px-4 py-2 text-sm font-bold text-ink transition-colors duration-150 hover:bg-honey-soft"
          >
            Instalar
          </button>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;
