import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppQTD from './AppQTD';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <AppQTD/>
    </StrictMode>
  </BrowserRouter>
);
