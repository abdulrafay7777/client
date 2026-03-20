// src/pages/overview.jsx
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { scans, timeline, behaviors } from "../data/mock";
import { StatTile }     from "../components/stat-tile";
import { BehaviorRadar } from "../components/behavior-radar";
import { ShapChart }    from "../components/shap-chart";
import { Panel }        from "../components/panel";
import { ZoneBadge } from "../components/badge";

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-raised border border-edge-hi rounded-lg px-3 py-2.5 text-[13px]">
      <p className="text-ink-muted mb-1.5 font-mono">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Overview() {
  const malware    = scans.filter((s) => s.zone === "MALWARE").length;
  const suspicious = scans.filter((s) => s.zone === "SUSPICIOUS").length;
  const safe       = scans.filter((s) => s.zone === "SAFE").length;
  const topFeatures = scans.find((s) => s.zone === "MALWARE")?.top_features ?? [];
  const reviewQueue = scans
    .filter((s) => s.zone === "SUSPICIOUS" || s.zone === "MALWARE")
    .slice(0, 6);

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 animate-fade-up">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[24px] font-bold tracking-tight text-ink-primary">Threat Overview</h1>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[12px] text-ink-dim tracking-widest uppercase">System</span>
          <span className="bg-warn-dim border border-warn-mid text-warn text-[12px] font-semibold px-3 py-1 rounded-full tracking-widest">
            DRIFT DETECTED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* KPI row */}
        <div className="col-span-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StatTile label="Total Scans" value={1847} sub="All time" color="info" icon="⬡" />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StatTile label="Threats" value={malware} sub="Detected today" color="threat" icon="⚠" pulse />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StatTile label="Under Review" value={suspicious} sub="Awaiting analyst" color="warn" icon="◉" pulse />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <StatTile label="Safe Files" value={safe} sub="Auto-cleared" color="safe" icon="✓" />
          </div>
        </div>

        {/* Timeline (12 cols, min 300px height) */}
        <Panel title="Scan activity — last 14 days" className="col-span-12">
          <div className="p-6 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "var(--color-t-dim)", fontFamily: "JetBrains Mono" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--color-t-dim)", fontFamily: "JetBrains Mono" }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="malware"    stroke="var(--color-threat)" strokeWidth={2.5} dot={false} name="Malware" />
                <Line type="monotone" dataKey="suspicious" stroke="var(--color-warn)"   strokeWidth={2.5} dot={false} name="Suspicious" />
                <Line type="monotone" dataKey="safe"       stroke="var(--color-safe)"   strokeWidth={2}   dot={false} name="Safe" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* SHAP (>= 8 cols) */}
        <div className="col-span-12 xl:col-span-8">
          <ShapChart features={topFeatures} className="h-[520px]" />
        </div>

        {/* Review queue (spacious list) */}
        <Panel title="Analyst review queue" className="col-span-12 xl:col-span-4">
          <div className="divide-y divide-white/10">
            {reviewQueue.map((s) => (
              <div key={s.id} className="px-6 py-4 hover:bg-raised transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[13px] font-mono text-ink-primary truncate">{s.filepath}</p>
                    <p className="text-[13px] text-ink-dim mt-1">
                      Risk score:{" "}
                      <span className={s.zone === "MALWARE" ? "text-threat font-semibold" : "text-warn font-semibold"}>
                        {typeof s.probability === "number" ? `${s.probability}%` : "—"}
                      </span>
                      {" · "}
                      <span className="font-mono">{typeof s.minsAgo === "number" ? `${s.minsAgo}m ago` : "—"}</span>
                    </p>
                  </div>
                  <ZoneBadge zone={s.zone} />
                </div>
              </div>
            ))}
            {reviewQueue.length === 0 && (
              <div className="px-6 py-10 text-center text-ink-dim">
                No files awaiting review
              </div>
            )}
          </div>
        </Panel>

        {/* Behavior radar (optional supporting card) */}
        <div className="col-span-12 xl:col-span-4">
          <BehaviorRadar data={behaviors} className="h-[360px]" />
        </div>
      </div>
    </div>
  );
}
