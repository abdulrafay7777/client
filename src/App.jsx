import { useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import { Navbar } from "./components/navbar";
import { ToastStack } from "./components/toast";
import { useStore } from "./store/ui";
import Overview from "./pages/overview";
import Scan     from "./pages/scan";
import History  from "./pages/history";
import Queue    from "./pages/queue";
import Health   from "./pages/health";

const pages = { overview: Overview, scan: Scan, history: History, queue: Queue, health: Health };

export default function App() {
  const { sidebarOpen, setSidebarOpen, page } = useStore();
  const Page = pages[page] || Overview;

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [page, setSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <div className={`${sidebarOpen ? "w-[260px]" : "w-16"} shrink-0 transition-all duration-200`}>
        <Sidebar collapsed={!sidebarOpen} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar />
        <main key={page} className="flex-1 overflow-y-auto animate-fade-up">
          <Page />
        </main>
      </div>
      <ToastStack />
    </div>
  );
}