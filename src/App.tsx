import { Route, Routes } from "react-router-dom"
import FooterComponent from "./components/FooterComponent"
import NavbarComponent from "./components/NavbarComponent"
import { CalculatePage } from "./pages/CalculatePage"
import HistoryPage from "./pages/HistoryPage";


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <NavbarComponent />
      <main className="flex-grow flex  justify-center items-center">
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
