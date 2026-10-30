import { Route, Routes } from "react-router-dom"
import FooterComponent from "./components/FooterComponent"
import InstallPrompt from "./components/InstallPrompt"
import NavbarComponent from "./components/NavbarComponent"
import UpdatePrompt from "./components/UpdatePrompt"
import { CalculatePage } from "./pages/CalculatePage"
import HistoryPage from "./pages/HistoryPage";


function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <NavbarComponent />
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-16 sm:px-7">
        <Routes>
          <Route path="/" element={<CalculatePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      <FooterComponent />

      {/* One stack for the install and update notices, so they never cover each other. */}
      <div className="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-[560px] flex-col gap-3">
        <UpdatePrompt />
        <InstallPrompt />
      </div>
    </div>
  );
}

export default App;
