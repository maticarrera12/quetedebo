import { createRoot } from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);
