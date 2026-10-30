import { Route, Routes } from "react-router-dom"
import BottomNav from "./components/BottomNav"
import FooterComponent from "./components/FooterComponent"
import HomeContent from "./components/HomeContent"
import InstallPrompt from "./components/InstallPrompt"
import IntentContent from "./components/IntentContent"
import NavbarComponent from "./components/NavbarComponent"
import UpdatePrompt from "./components/UpdatePrompt"
import { INTENT_PAGES } from "./content/intents"
import { useIsMobile } from "./hooks/useMediaQuery"
import { CalculatePage } from "./pages/CalculatePage"
import HistoryPage from "./pages/HistoryPage";


function App() {
  // A phone gets an app shell (bottom bar, no footer); a computer keeps the page.
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-dvh flex-col">
      {!isMobile && <NavbarComponent />}

      <main
        className={
          isMobile
            ? "flex-1 pb-[calc(7rem+env(safe-area-inset-bottom))]"
            : "mx-auto w-full max-w-[1180px] flex-1 px-4 pb-16 sm:px-7"
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <>
                <CalculatePage />
                <HomeContent />
              </>
            }
          />
          {INTENT_PAGES.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={
                <>
                  <CalculatePage />
                  <IntentContent page={page} />
                </>
              }
            />
          ))}
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>

      {isMobile ? <BottomNav /> : <FooterComponent />}

      {/* One stack for the install and update notices, so they never cover each other. */}
      <div
        className={`pointer-events-none fixed inset-x-4 z-10 mx-auto flex max-w-[560px] flex-col gap-3 ${
          isMobile ? "bottom-[calc(6rem+env(safe-area-inset-bottom))]" : "bottom-[max(1rem,env(safe-area-inset-bottom))]"
        }`}
      >
        <UpdatePrompt />
        <InstallPrompt />
      </div>
    </div>
  );
}

export default App;
