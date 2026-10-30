import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

import App from "./App.tsx";

export const render = (url: string): string =>
  renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
