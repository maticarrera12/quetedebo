import { Link, useParams } from "react-router-dom";

import { useIsMobile } from "../hooks/useMediaQuery";
import { useSharedMesa } from "../hooks/useSharedMesa";

import DesktopMesa from "./DesktopMesa";
import MobileMesa from "./MobileMesa";

const Message = ({ title, text }: { title: string; text: string }) => (
  <section className="px-4 pt-16 pb-8 text-center sm:px-0 sm:pt-24">
    <h1 className="mx-auto max-w-[18ch] text-[clamp(32px,5vw,52px)] leading-[0.98] font-extrabold tracking-[-0.04em] text-balance">
      {title}
    </h1>

    <p className="mx-auto mt-4 max-w-[34ch] text-[17px] text-muted">{text}</p>

    <Link
      to="/"
      className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-ink px-6 text-base font-bold text-ground"
    >
      Ir a mi mesa
    </Link>
  </section>
);

const SharedMesa = ({ mesaId }: { mesaId: string }) => {
  const mesa = useSharedMesa(mesaId);
  const isMobile = useIsMobile();

  if (mesa.status === "loading") {
    return (
      <p role="status" className="px-4 pt-24 text-center text-lg font-semibold text-muted">
        Buscando la mesa…
      </p>
    );
  }

  if (mesa.status === "missing") {
    return <Message title="Esta mesa no existe" text="Puede que el link esté incompleto. Pedile al grupo que lo mande de nuevo." />;
  }

  if (mesa.status === "unconfigured") {
    return <Message title="Mesas compartidas no disponibles" text="Esta versión de la app no tiene las mesas compartidas activadas." />;
  }

  if (mesa.status === "error") {
    return <Message title="No pudimos abrir la mesa" text="Revisá tu conexión y volvé a abrir el link." />;
  }

  return (
    <>
      {mesa.syncError && (
        <p
          role="alert"
          className="mx-4 mt-[calc(0.5rem+env(safe-area-inset-top))] rounded-2xl bg-sand px-4 py-3 text-sm font-semibold text-danger sm:mx-0"
        >
          {mesa.syncError}
        </p>
      )}

      {isMobile ? <MobileMesa mesa={mesa} /> : <DesktopMesa mesa={mesa} />}
    </>
  );
};

// /m/:id — a mesa that lives on the server and everyone with the link edits.
const SharedMesaPage = () => {
  const { id = "" } = useParams();

  // Keyed by id so moving between two shared mesas starts from a clean state.
  return <SharedMesa key={id} mesaId={id} />;
};

export default SharedMesaPage;
