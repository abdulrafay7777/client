// src/components/zone-badge.jsx
const cfg = {
  MALWARE:    "bg-mal-bg  border border-mal-border  text-mal  ",
  SUSPICIOUS: "bg-susp-bg border border-susp-border text-susp ",
  SAFE:       "bg-safe-bg border border-safe-border text-safe ",
};

export function ZoneBadge({ zone }) {
  return (
    <span className={`${cfg[zone] ?? cfg.SAFE} text-[10px] font-bold px-3 py-1 rounded tracking-widest`}>
      {zone}
    </span>
  );
}

export function ZoneDot({ zone }) {
  const color = { MALWARE: "bg-mal", SUSPICIOUS: "bg-susp", SAFE: "bg-safe" }[zone] ?? "bg-safe";
  return <span className={`inline-block w-2 h-2 rounded-full ${color} shrink-0`} />;
}
