import { Route, Routes } from "react-router-dom"
import FooterComponent from "./components/FooterComponent"
import NavbarComponent from "./components/NavbarComponent"
import { CalculatePage } from "./pages/CalculatePage"
import HistoryPage from "./pages/HistoryPage";


function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarComponent />
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-16 sm:px-7">
        <Routes>
          <Route path="/" element={<CalculatePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      <FooterComponent />
    </div>
  );
}

export default App;
