// src/components/topbar.jsx
import { useState, useEffect } from "react";
import { useStore } from "../store/ui";
import { drift } from "../data/mock";
import { RiMenu2Fill } from "react-icons/ri";

const PAGE_TITLES = {
  dashboard: "Overview",
  scanner:   "File Scanner",
  queue:     "Analyst Queue",
  drift:     "Drift Monitor",
};

export function Topbar() {
  const { page, toggleSidebar } = useStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const showDriftAlert = drift.status !== "STABLE";

  return (
    <header className="h-11 bg-bg border-b border-border px-5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden text-t-dim hover:text-t-primary text-lg leading-none"><RiMenu2Fill /></button>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-[17px] font-bold text-t-primary">{PAGE_TITLES[page] ?? page}</h1>
          {showDriftAlert && (
            <span className="bg-susp-bg border border-susp-border text-susp text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              ● Prediction drift detected
            </span>
          )}
        </div>
      </div>
      <span className="text-[12px] text-t-secondary tabular-nums">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
    </header>
  );
}
