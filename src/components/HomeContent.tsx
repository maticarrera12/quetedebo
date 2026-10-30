import { useId, useState } from "react";
import type { JSX } from "react";
import { Link } from "react-router-dom";

import { INTENT_PAGES } from "../content/intents";

const STEPS = [
  {
    title: "Sumá a cada amigo y lo que puso",
    text: "Anotá quién pagó qué en la juntada: la carne del asado, las bebidas, el alquiler del quincho o el super del viaje.",
  },
  {
    title: "La app hace la cuenta",
    text: "Suma el total, calcula cuánto le toca a cada uno en partes iguales y ve quién puso de más y quién de menos.",
  },
  {
    title: "Mirá quién le pasa cuánto a quién",
    text: "Te muestra las transferencias para quedar a mano. Copiás el resumen y lo pegás en el grupo de WhatsApp.",
  },
];

const FAQ = [
  {
    question: "¿Cómo dividir los gastos de un asado entre amigos?",
    answer:
      "Sumá a cada amigo con lo que puso (la carne, el carbón, las bebidas) y la app reparte el total en partes iguales. Después te dice quién le tiene que transferir a quién para que nadie quede perdiendo plata.",
  },
  {
    question: "¿Cómo repartir la plata de un viaje con amigos?",
    answer:
      "Cargá a cada persona con el total que gastó en nombre del grupo: alojamiento, nafta, comidas. La app calcula lo que le toca a cada uno y arma las transferencias para saldar las cuentas.",
  },
  {
    question: "¿Cómo se calcula quién le debe a quién?",
    answer:
      "Se suma todo lo gastado y se divide por la cantidad de personas. Quien puso más que esa parte tiene plata a favor, quien puso menos le debe a los que pusieron de más. La app los junta de a pares para que haya pocas transferencias.",
  },
  {
    question: "¿Tengo que registrarme o instalar algo?",
    answer:
      "No. Es gratis, no pide cuenta y funciona desde el navegador. Tu mesa se guarda sola en tu dispositivo, y si querés podés instalarla como app en el celular.",
  },
  {
    question: "¿Sirve para dividir el alquiler o los gastos de una casa compartida?",
    answer:
      "Sí. Cargá lo que puso cada compañero (alquiler, expensas, servicios, el super) y la app te dice cuánto le toca a cada uno y quién le debe a quién.",
  },
];

// The answer stays in the DOM while closed (search engines read it); only its height collapses.
function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}): JSX.Element {
  const panelId = useId();

  return (
    <div className="py-1">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left text-[17px] font-bold"
        >
          {question}
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={`size-5 shrink-0 text-muted transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h3>

      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-3 text-[15px] text-muted">{answer}</p>
        </div>
      </div>
    </div>
  );
}

// Plain text under the calculator: this is what search engines read to know what the app is for.
function HomeContent(): JSX.Element {
  // One answer open at a time: opening another closes the current one.
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <section aria-labelledby="como-funciona" className="mx-auto hidden max-w-[760px] pt-14 pb-8 sm:block">
      <h2 id="como-funciona" className="text-[28px] font-extrabold tracking-[-0.03em] text-balance sm:text-4xl">
        Cómo dividir los gastos con tus amigos
      </h2>

      <ol className="mt-6 grid gap-5 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <span className="text-sm font-bold text-accent-deep">Paso {index + 1}</span>
            <h3 className="mt-1 text-lg leading-snug font-bold">{step.title}</h3>
            <p className="mt-2 text-[15px] text-muted">{step.text}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-14 text-[28px] font-extrabold tracking-[-0.03em] text-balance sm:text-4xl">
        Preguntas frecuentes
      </h2>

      <div className="mt-4 divide-y divide-line border-y border-line">
        {FAQ.map((item) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            open={openQuestion === item.question}
            onToggle={() => setOpenQuestion((current) => (current === item.question ? null : item.question))}
          />
        ))}
      </div>

      <nav aria-label="Guías" className="mt-10">
        <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-balance sm:text-4xl">Guías</h2>
        <ul className="mt-3 space-y-1">
          {INTENT_PAGES.map((page) => (
            <li key={page.path}>
              <Link to={page.path} className="font-semibold text-accent-deep underline-offset-4 hover:underline">
                {page.linkLabel}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

export default HomeContent;
