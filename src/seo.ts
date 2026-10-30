import { INTENT_PAGES } from "./content/intents";

export const SITE_URL = "https://quetedebo.vercel.app";

export interface PrerenderRoute {
  path: string;
  title: string;
  description: string;
  // Written to this file instead of <path>/index.html, and kept out of search results.
  errorFile?: string;
}

// Pages written to disk as static HTML at build time, so search engines read the text without
// running any JavaScript. The client still renders the app from scratch on top of them.
export const PRERENDER_ROUTES: PrerenderRoute[] = [
  {
    path: "/",
    title: "¿Qué te debo?",
    description:
      "Dividí los gastos de la juntada con tus amigos: cargá lo que puso cada uno y mirá quién le pasa cuánto a quién.",
  },
  {
    path: "/404",
    title: "Página no encontrada | ¿Qué te debo?",
    description: "Esta página no existe. Volvé al inicio para dividir los gastos con tus amigos.",
    errorFile: "404.html",
  },
  ...INTENT_PAGES.map(({ path, title, description }) => ({ path, title, description })),
];
