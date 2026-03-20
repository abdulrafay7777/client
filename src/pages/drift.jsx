// src/pages/drift.jsx
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { drift } from "../data/mock";
import { useStore } from "../store/ui";

function BarTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-raised border border-border-hi rounded-lg px-3 py-2 text-[11px]">
      <p className="text-t-secondary mb-1">{label}</p>
      <p className="text-t-primary">{payload[0].value} features</p>
    </div>
  );
}

function StatBlock({ label, value, color, sub }) {
  const colorClass = {
    mal:  "text-mal",
    susp: "text-susp",
    safe: "text-safe",
    info: "text-info",
    dim:  "text-t-secondary",
  }[color] ?? "text-t-primary";

  return (
    <div className="bg-card border border-border rounded-xl px-5 py-4">
      <p className="text-[10px] text-t-dim tracking-widest uppercase mb-2">{label}</p>
      <p className={`font-display text-[36px] font-extrabold leading-none ${colorClass}`}>{value}</p>
      {sub && <p className="text-[10px] text-t-secondary mt-2">{sub}</p>}
    </div>
  );
}

export default function Drift() {
  const { notify } = useStore();
  const d = drift;
  const isWarning = d.status !== "STABLE";

  const barData = [
    { name: "Stable",  value: d.feature_drift.stable,  fill: "#00d084" },
    { name: "Drifted", value: d.feature_drift.drifted, fill: "#ff3b3b" },
  ];

  return (
    <div className="p-5 flex flex-col gap-5 animate-fade-up">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-bold text-t-primary">Drift Monitor</h2>
        <p className="text-[11px] text-t-secondary mt-1">
          drift_monitor.py · Sliding window: last {d.window_size} scans
        </p>
      </div>

      {/* Status banner */}
      <div className={`border rounded-xl px-5 py-4 flex items-center gap-4
        ${isWarning ? "bg-susp-bg border-susp-border" : "bg-safe-bg border-safe-border"}`}>
        <span className="text-3xl">{isWarning ? "⚡" : "✓"}</span>
        <div>
          <p className={`font-display text-lg font-bold ${isWarning ? "text-susp" : "text-safe"}`}>
            {d.status}
          </p>
          <p className="text-[11px] text-t-secondary mt-0.5">
            Total scans: {d.total_scans.toLocaleString()} &nbsp;·&nbsp; Alerts raised: {d.alerts_raised}
          </p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        <StatBlock
          label="Feature Drift"
          value={`${d.feature_drift.drifted}/${d.feature_drift.total}`}
          color="mal"
          sub="features drifted from baseline"
        />
        <StatBlock
          label="Prediction Shift"
          value={`+${d.prediction_drift.shift}%`}
          color="susp"
          sub={`${d.prediction_drift.baseline}% → ${d.prediction_drift.current}%`}
        />
        <StatBlock
          label="Avg Confidence"
          value={`${d.avg_confidence}%`}
          color="info"
          sub="across last 100 scans"
        />
      </div>

      {/* Alert cards */}
      {d.alerts.map((a, i) => (
        <div key={i} className={`border rounded-xl p-4
          ${a.severity === "HIGH" ? "bg-mal-bg border-mal-border" : "bg-susp-bg border-susp-border"}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[11px] font-semibold ${a.severity === "HIGH" ? "text-mal" : "text-susp"}`}>
              {a.type}
            </span>
            <span className={`text-[9px] border px-1.5 py-0.5 rounded font-bold tracking-widest
              ${a.severity === "HIGH" ? "border-mal-border text-mal" : "border-susp-border text-susp"}`}>
              {a.severity}
            </span>
          </div>
          <p className="text-[12px] text-t-secondary mb-1">{a.message}</p>
          <p className="text-[11px] text-t-dim">→ {a.recommendation}</p>
        </div>
      ))}

      {/* Charts */}
      <div className="grid grid-cols-[220px_1fr] gap-4">
        {/* Feature stability bar */}
        <div className="bg-card border border-border rounded-xl overflow-hidden h-55">
          <p className="px-4 py-3 text-[10px] font-semibold tracking-widest uppercase text-t-secondary border-b border-border">
            Feature Stability
          </p>
          <div className="h-[calc(100%-44px)] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barCategoryGap="35%">
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#888", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#444", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={<BarTip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="value" radius={4}>
                  {barData.map((e, i) => <Cell key={i} fill={e.fill} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prediction drift comparison */}
        <div className="bg-card border border-border rounded-xl overflow-hidden h-55">
          <p className="px-4 py-3 text-[10px] font-semibold tracking-widest uppercase text-t-secondary border-b border-border">
            Prediction Rate — Baseline vs Current
          </p>
          <div className="p-5 h-[calc(100%-44px)] flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-raised border border-border rounded-xl p-4">
                <p className="text-[9px] text-t-dim tracking-widest uppercase mb-2">Baseline Rate</p>
                <p className="font-display text-3xl font-extrabold text-t-secondary">
                  {d.prediction_drift.baseline}%
                </p>
                <p className="text-[10px] text-t-dim mt-1">Training distribution</p>
              </div>
              <div className="bg-susp-bg border border-susp-border rounded-xl p-4">
                <p className="text-[9px] text-susp tracking-widest uppercase mb-2">Current Rate</p>
                <p className="font-display text-3xl font-extrabold text-susp">
                  {d.prediction_drift.current}%
                </p>
                <p className="text-[10px] text-t-secondary mt-1">+{d.prediction_drift.shift}% shift detected</p>
              </div>
            </div>
            <p className="text-[11px] text-t-secondary leading-relaxed">
              Detection rate shifted <strong className="text-susp">+{d.prediction_drift.shift}%</strong> above
              EMBER training baseline — exceeds the 15% PREDICTION_DRIFT_THRESHOLD. Consider retraining.
            </p>
          </div>
        </div>
      </div>

      {/* Retrain CTA */}
      <div className="bg-card border border-border rounded-xl px-5 py-4 flex justify-between items-center">
        <div>
          <p className="text-[13px] font-semibold text-t-primary mb-1">
            Initiate model retraining pipeline
          </p>
          <p className="text-[11px] text-t-secondary">
            Triggers train_model.py with recent scan data appended to EMBER dataset
          </p>
        </div>
        <button
          onClick={() => notify({ type: "warning", title: "Retraining queued", message: "train_model.py will run with recent scans appended." })}
          className="bg-susp-bg border border-susp-border text-susp text-[12px] font-semibold px-5 py-2.5 rounded-xl hover:opacity-80 transition-opacity"
        >
          ⌬ Retrain Model
        </button>
      </div>
    </div>
  );
}
