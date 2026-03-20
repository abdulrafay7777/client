// src/components/sidebar.jsx
import { useStore } from "../store/ui";
import { scans } from "../data/mock";
import { MdDocumentScanner, MdSecurity, MdDashboard } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";

const navItems = [
  { id: "overview", label: "Overview",     icon: <MdDashboard />  }, // Swapped to match your image
  { id: "scan",     label: "Scan File",    icon: <MdDocumentScanner /> },
  { id: "history",  label: "History",      icon: <FaHistory /> },
  { id: "queue",    label: "Review Queue", icon: "◉" },
  { id: "health",   label: "Model Health", icon: "⌬" },
];

export function Sidebar({ collapsed }) {
  const { page, goTo, toggleSidebar } = useStore();
  const queueCount = scans?.filter((s) => s.zone === "SUSPICIOUS").length || 0;

  return (
    <aside className="h-screen bg-surface border-r border-edge flex flex-col w-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      
      {/* Header / Logo Area */}
      <div className={`flex items-center gap-3 min-h-[72px] ${collapsed ? "justify-center px-0" : "px-6"}`}>
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-raised transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
          aria-label="Toggle Sidebar"
        >
          <RiMenu2Fill className="text-xl" />
        </button>
        
        {/* Desktop Brand */}
        <div className="hidden lg:flex items-center gap-3 w-full">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-threat to-warn flex items-center justify-center text-xl shrink-0 shadow-sm border border-white/10">
            <MdSecurity className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-[16px] font-bold tracking-tight text-ink-primary leading-none">SecureAI</span>
              <span className="text-[12px] font-medium text-ink-dim mt-1 tracking-wide uppercase">Detection Engine</span> 
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
              className={`
                group relative flex items-center w-full transition-all duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
                overflow-hidden
                ${collapsed ? "justify-center rounded-xl p-3" : "justify-between rounded-xl py-2.5 pr-3 pl-4"}
                ${active
                  ? "bg-blue-500/10 text-blue-500 font-medium"
                  : "text-ink-muted hover:bg-white/5 hover:text-ink-primary"
                }
              `}
            >
              {/* The Blue Left Edge Indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[60%] bg-blue-500 rounded-r-md shadow-[2px_0_8px_rgba(59,130,246,0.5)]" />
              )}

              <span className="flex items-center gap-3">
                <span className={`text-[18px] transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                  {item.icon} 
                </span>
                {!collapsed && <span className="text-[14px] tracking-wide">{item.label}</span>}
              </span>

              {/* Badges */}
              {!collapsed && item.id === "queue" && queueCount > 0 && (
                <span className="bg-warn/10 text-warn border border-warn/20 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {queueCount}
                </span>
              )}
              {!collapsed && item.id === "health" && (
                <span className="flex items-center justify-center w-5 h-5 bg-warn/10 border border-warn/30 text-warn text-[10px] rounded-full font-bold">
                  !
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      {!collapsed && (
        <div className="m-4 p-4 rounded-xl bg-raised/30 border border-edge/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <p className="text-[11px] font-semibold text-ink-dim tracking-widest uppercase">System Active</p>
          </div>
          <p className="text-[13px] font-medium text-ink-primary">EMBER Ensemble v1.0</p>
          <p className="text-[12px] text-ink-muted mt-0.5">Tri-Zone Classifier Active</p>
        </div>
      )}
    </aside>
  );
}