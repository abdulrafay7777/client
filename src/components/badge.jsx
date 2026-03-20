// src/components/badge.jsx

export function ZoneBadge({ zone }) {
  const styles = {
    MALWARE:    "bg-threat-dim border border-threat-mid text-threat",
    SUSPICIOUS: "bg-warn-dim border border-warn-mid text-warn",
    SAFE:       "bg-safe-dim border border-safe-mid text-safe",
  };
  return (
    <span className={`${styles[zone]} text-[12px] font-bold px-3 py-1 rounded-full tracking-widest`}>
      {zone}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const style = severity === "HIGH"
    ? "bg-threat-dim border-threat-mid text-threat"
    : "bg-warn-dim border-warn-mid text-warn";
  return (
    <span className={`${style} border text-[12px] font-bold px-3 py-1 rounded-full tracking-wider`}>
      {severity}
    </span>
  );
}

export function Tag({ label }) {
  return (
    <span className="bg-lift border border-edge-hi text-ink-dim text-[12px] px-3 py-1 rounded-full">
      {label}
    </span>
  );
}
