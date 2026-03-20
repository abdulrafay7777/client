// src/components/prob-bar.jsx
export function ProbBar({ probability, zone }) {
  const color = {
    MALWARE:    "bg-mal",
    SUSPICIOUS: "bg-susp",
    SAFE:       "bg-safe",
  }[zone] ?? "bg-safe";

  return (
    <div className="flex flex-col gap-0.5 w-20">
      <div className="h-1 rounded-full bg-raised overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${probability}%` }} />
      </div>
      <span className="text-[10px] text-t-secondary">{probability}%</span>
    </div>
  );
}
