// src/components/stat-card.jsx
const colorMap = {
  default: "text-t-primary",
  mal:     "text-mal",
  susp:    "text-susp",
  safe:    "text-safe",
  info:    "text-info",
};

export function StatCard({ label, value, color = "default" }) {
  return (
    <div className="bg-card border border-border rounded-xl px-5 py-4 flex flex-col gap-2">
      <p className="text-[10px] text-t-dim tracking-widest uppercase">{label}</p>
      <p className={`font-display text-[42px] font-extrabold leading-none ${colorMap[color]}`}>
        {value}
      </p>
    </div>
  );
}
