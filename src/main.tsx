import { createRoot } from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "./index.css";
import App from "./App.tsx";
import { startInstallListeners } from "./utils/install";
import { startStaleChunkReload } from "./utils/staleChunk";
import { BrowserRouter } from "react-router-dom";

startInstallListeners();
startStaleChunkReload();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);
