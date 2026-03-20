// src/components/scan-row.jsx
import { ZoneBadge, ZoneDot } from "./zone-badge";
import { ProbBar } from "./prob-bar";

function timeAgo(mins) {
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  return `${h}h ago`;
}

export function ScanRow({ scan, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 border-b border-border hover:bg-card transition-colors cursor-pointer"
    >
      {/* Dot */}
      <ZoneDot zone={scan.zone} />

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-t-primary truncate">{scan.filename}</p>
        <p className="text-[10px] text-t-dim truncate mt-0.5">{scan.filepath}</p>
      </div>

      {/* Zone badge */}
      <ZoneBadge zone={scan.zone} />

      {/* Probability bar */}
      <ProbBar probability={scan.probability} zone={scan.zone} />

      {/* Time */}
      <span className="text-[11px] text-t-secondary w-14 text-right shrink-0">
        {timeAgo(scan.minsAgo)}
      </span>

      {/* Review status */}
      <span className={`text-[10px] w-14 text-right shrink-0 ${
        scan.zone === "SUSPICIOUS" && !scan.reviewed ? "text-susp" :
        scan.reviewed ? "text-t-dim" : "text-t-dim"
      }`}>
        {scan.zone === "SUSPICIOUS" && !scan.reviewed
          ? "pending"
          : scan.reviewed
          ? "reviewed"
          : "—"}
      </span>
    </div>
  );
}
