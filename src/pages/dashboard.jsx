// src/pages/dashboard.jsx
import { scans, behaviors } from "../data/mock";
import { StatCard }      from "../components/stat-card";
import { ScanRow }       from "../components/scan-row";
import { BehaviorRadar } from "../components/behavior-radar";
import { ShapChart }     from "../components/shap-chart";

export default function Dashboard() {
  const total     = scans.length;
  const malware   = scans.filter((s) => s.zone === "MALWARE").length;
  const suspicious= scans.filter((s) => s.zone === "SUSPICIOUS").length;
  const safe      = scans.filter((s) => s.zone === "SAFE").length;
  const queue     = scans.filter((s) => s.zone === "SUSPICIOUS" && !s.reviewed).length;

  const topFeatures = scans.find((s) => s.zone === "MALWARE")?.top_features ?? [];

  const TABLE_HEADERS = ["FILE", "ZONE", "PROBABILITY", "TIME", "REVIEW"];

  return (
    <div className="p-5 flex flex-col gap-5 animate-fade-up">

      {/* Stat tiles */}
      <div className="grid grid-cols-5 gap-3">
        <StatCard label="Total Scans"   value={total}      color="default" />
        <StatCard label="Malware"       value={malware}    color="mal"     />
        <StatCard label="Suspicious"    value={suspicious} color="susp"    />
        <StatCard label="Safe"          value={safe}       color="safe"    />
        <StatCard label="Review Queue"  value={queue}      color="susp"    />
      </div>

      {/* Recent scans table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid gap-4 px-4 py-2.5 border-b border-border bg-card"
          style={{ gridTemplateColumns: "20px 1fr 120px 100px 80px 80px" }}>
          <div />
          {TABLE_HEADERS.map((h) => (
            <p key={h} className="text-[9px] font-semibold tracking-widest text-t-dim uppercase">{h}</p>
          ))}
        </div>

        {/* Rows */}
        {scans.map((s) => <ScanRow key={s.id} scan={s} />)}
      </div>

      {/* Radar + SHAP */}
      <div className="grid grid-cols-[280px_1fr] gap-4">
        <BehaviorRadar data={behaviors} className="h-70" />
        <ShapChart features={topFeatures} className="h-70" />
      </div>
    </div>
  );
}
