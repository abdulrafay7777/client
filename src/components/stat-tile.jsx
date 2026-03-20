// src/components/stat-tile.jsx
export function StatTile({ label, value, sub, color, pulse }) {
  // color is a Tailwind class fragment e.g. "threat" | "warn" | "safe" | "info"
  const colorMap = {
    threat: { bar: "bg-threat", text: "text-threat", pulse: "animate-pulse-red" },
    warn:   { bar: "bg-warn", text: "text-warn", pulse: "animate-pulse-amber" },
    safe:   { bar: "bg-safe", text: "text-safe", pulse: "" },
    info:   { bar: "bg-info", text: "text-info", pulse: "" },
  };
  const c = colorMap[color] || colorMap.info;

  return (
    <div className="animate-fade-up bg-card border border-edge rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden">
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${c.bar}`} />

      <div className="flex justify-between items-start">
        <span className="text-[12px] text-ink-muted tracking-widest uppercase">{label}</span>
      </div>

      <div className="flex items-end gap-2">
        <span className={`font-display text-[44px] font-extrabold leading-none ${c.text}`}>
          {value}
        </span>
        {pulse && (
          <span className={`w-2 h-2 rounded-full mb-1.5 ${c.bar} ${c.pulse}`} />
        )}
      </div>

      {sub && <span className="text-[13px] text-ink-dim">{sub}</span>}
    </div>
  );
}
