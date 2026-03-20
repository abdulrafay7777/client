// src/components/sidebar.jsx
import { useStore } from "../store/ui";
import { scans } from "../data/mock";
import { MdDocumentScanner } from "react-icons/md";
import { GrOverview } from "react-icons/gr";
import { FaHistory } from "react-icons/fa";

const navItems = [
  { id: "overview", label: "Overview",     icon: <GrOverview />  },
  { id: "scan",     label: "Scan File",    icon: <MdDocumentScanner /> },
  { id: "history",  label: "History",      icon: <FaHistory /> },
  { id: "queue",    label: "Review Queue", icon: "◉" },
  { id: "health",   label: "Model Health", icon: "⌬" },
];

export function Sidebar({ collapsed }) {
  const { page, goTo } = useStore();
  const queueCount = scans.filter((s) => s.zone === "SUSPICIOUS").length;

  return (
    <aside className="h-screen bg-surface border-r border-edge flex flex-col overflow-hidden w-full">

      {/* Logo */}
      <div className={`border-b border-edge flex items-center gap-3 ${collapsed ? "justify-center py-4 px-0" : "px-4 py-5"}`}>
        <div className="w-8 h-8 rounded-md bg-threat-dim border border-threat-mid grid place-items-center text-sm shrink-0">
          ⚠
        </div>
        {!collapsed && (
          <div>
            <p className="font-display text-[15px] font-bold tracking-tight text-ink-primary">AI Powered Malware Detection System</p>
            
          </div>
        )}
      </div>

      {/* Status pill */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-edge">
          <div className="bg-warn-dim border border-warn-mid rounded-lg px-3 py-2">
            <p className="text-[12px] text-warn tracking-widest mb-1 uppercase">System status</p>
            <p className="text-[13px] font-semibold text-warn">⚡ Drift detected</p>
          </div>
        </div>
      )}

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
