// src/components/scan-table.jsx
import { useRef, useState } from "react";
import { ZoneBadge } from "./badge";
import { Panel } from "./panel";
import { Popover } from "./popover";
import { Button } from "./button";

const FILTERS = ["ALL", "MALWARE", "SUSPICIOUS", "SAFE"];

export function ScanTable({ scans = [] }) {
  const [zone, setZone]     = useState("ALL");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterBtnRef = useRef(null);

  const rows = scans
    .filter((s) => zone === "ALL" || s.zone === zone)
    .filter((s) => !search || s.filepath.toLowerCase().includes(search.toLowerCase()));

  const getProbability = (s) => (typeof s?.malware_probability === "number" ? s.malware_probability : s?.probability);
  const getConfidence = (s) => (typeof s?.confidence === "number" ? s.confidence : null);
  const getScannedLabel = (s) => {
    if (s?.timestamp) return new Date(s.timestamp).toLocaleString();
    if (typeof s?.minsAgo === "number") return `${s.minsAgo}m ago`;
    return "—";
  };

  const filterBar = (
    <div className="flex items-center gap-2">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search file…"
        className="bg-raised border border-edge-hi text-ink-primary text-[13px] rounded-lg px-3 py-2 w-52 outline-none focus:border-info placeholder:text-ink-dim font-mono"
      />
      <div className="relative">
        <Button
          variant="default"
          size="md"
          className="min-w-[200px] justify-between"
          onClick={() => setFilterOpen((v) => !v)}
          ref={filterBtnRef}
        >
          <span className="font-mono">Zone: {zone}</span>
          <span className="text-ink-dim">▾</span>
        </Button>
        <Popover
          open={filterOpen}
          anchorRef={filterBtnRef}
          onClose={() => setFilterOpen(false)}
          minWidth={200}
        >
          <div className="py-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`w-full text-left px-4 py-3 text-[13px] font-mono ${
                  zone === f ? "text-ink-primary bg-card" : "text-ink-muted hover:bg-card hover:text-ink-primary"
                }`}
                onClick={() => {
                  setZone(f);
                  setFilterOpen(false);
                }}
                role="menuitem"
              >
                {f}
              </button>
            ))}
          </div>
        </Popover>
      </div>
    </div>
  );

  return (
    <Panel title={`${rows.length} records`} action={filterBar}>
      <div className="overflow-x-auto">
        <table className="w-full text-[14px] border-collapse">
          <thead>
            <tr className="border-b border-edge">
              {["File", "Zone", "Prob %", "Confidence", "Behaviors", "Scanned"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[12px] text-ink-dim tracking-widest font-semibold uppercase whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s, i) => (
              <tr
                key={s.id}
                className={`border-b border-edge transition-colors hover:bg-raised ${i % 2 !== 0 ? "bg-white/[0.012]" : ""}`}
              >
                <td className="px-5 py-4 text-ink-primary font-medium max-w-80 truncate font-mono text-[13px]">
                  {s.filepath ?? s.filename ?? "—"}
                </td>
                <td className="px-5 py-4">
                  <ZoneBadge zone={s.zone} />
                </td>
                <td className="px-5 py-4">
                  <span className={
                    s.zone === "MALWARE" ? "text-threat font-semibold" :
                    s.zone === "SUSPICIOUS" ? "text-warn font-semibold" : "text-safe font-semibold"
                  }>
                    {(() => {
                      const p = getProbability(s);
                      return typeof p === "number" ? `${p}%` : "—";
                    })()}
                  </span>
                </td>
                <td className="px-5 py-4 text-ink-muted">
                  {(() => {
                    const c = getConfidence(s);
                    return typeof c === "number" ? `${c.toFixed(1)}%` : "—";
                  })()}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {s.threat_behaviors.slice(0, 2).map((b, bi) => (
                      <span key={bi} className="bg-lift border border-edge-hi text-ink-dim text-[12px] px-3 py-1 rounded-full">
                        {b.label.split("/")[0].trim()}
                      </span>
                    ))}
                    {s.threat_behaviors.length === 0 && <span className="text-ink-dim">—</span>}
                  </div>
                </td>
                <td className="px-5 py-4 text-ink-dim text-[12px] whitespace-nowrap font-mono">
                  {getScannedLabel(s)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-ink-dim">
                  No results for current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
