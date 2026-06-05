import { Route, Routes } from "react-router-dom"
import FooterComponent from "./components/FooterComponent"
import NavbarComponent from "./components/NavbarComponent"
import { CalculatePage } from "./pages/CalculatePage"
import HistoryPage from "./pages/HistoryPage";


function App() {
  return (
    <div className="min-h-screen flex flex-col dark neon-bg">
      <NavbarComponent />
      <main className="flex-grow w-full flex justify-center items-start lg:items-center px-4 sm:px-6">
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
