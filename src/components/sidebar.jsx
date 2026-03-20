// src/components/sidebar.jsx
import { useStore } from "../store/ui";
import { scans } from "../data/mock";
import { MdDocumentScanner } from "react-icons/md";
import { GrOverview } from "react-icons/gr";
import { FaHistory } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { MdSecurity } from "react-icons/md";

const navItems = [
  { id: "overview", label: "Overview",     icon: <GrOverview />  },
  { id: "scan",     label: "Scan File",    icon: <MdDocumentScanner /> },
  { id: "history",  label: "History",      icon: <FaHistory /> },
  { id: "queue",    label: "Review Queue", icon: "◉" },
  { id: "health",   label: "Model Health", icon: "⌬" },
];

export function Sidebar({ collapsed }) {
  const { page, goTo, toggleSidebar } = useStore();
  const queueCount = scans.filter((s) => s.zone === "SUSPICIOUS").length;

  return (
    <aside className="h-screen bg-surface border-r border-edge flex flex-col overflow-hidden w-full">

      {/* Logo / Menu Button */}
      <div className={`border-b border-edge flex items-center gap-3 ${collapsed ? "justify-center py-4 px-0" : "px-4 py-5"}`}>
        {/* Menu button - visible only on mobile */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden text-ink-muted hover:text-ink-primary text-xl leading-none transition-colors"
        >
          <RiMenu2Fill />
        </button>
        
        {/* Logo - visible only on desktop */}
        <div className="hidden lg:flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-threat to-warn grid place-items-center text-2xl shrink-0 shadow-lg">
            <MdSecurity className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-display text-[15px] font-bold tracking-tight text-ink-primary">SecureAI</p>
              {/* FIX: Properly formed paragraph tag */}
              <p className="text-[11px] text-ink-dim">Malware Detection</p> 
            </div>
          )}
        {/* FIX: Properly closed divs and conditions */}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {navItems.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
              className={`
                w-full flex items-center gap-2.5 rounded-lg transition-all duration-150
                ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5 justify-between"}
                ${active
                  ? "bg-raised text-ink-primary border-l-2 border-info font-semibold"
                  : "text-ink-muted hover:bg-raised hover:text-ink-primary border-l-2 border-transparent"
                }
              `}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-[15px]">{item.icon}</span>
                {!collapsed && <span className="text-[14px]">{item.label}</span>}
              </span>
              {!collapsed && item.id === "queue" && queueCount > 0 && (
                <span className="bg-warn text-black text-[12px] font-bold px-2 py-0.5 rounded-full">
                  {queueCount}
                </span>
              )}
              {!collapsed && item.id === "health" && (
                <span className="bg-warn-dim border border-warn-mid text-warn text-[12px] px-2 py-0.5 rounded-full font-semibold">!</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-edge px-4 py-3">
          <p className="text-[12px] text-ink-dim tracking-widest mb-1 uppercase">Model</p>
          <p className="text-[13px] text-ink-muted">EMBER Ensemble v1.0</p>
          <p className="text-[12px] text-ink-dim mt-1">SHAP · Tri-Zone Classifier</p>
        </div>
      )}
    </aside>
  );
}