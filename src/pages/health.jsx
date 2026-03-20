// src/pages/health.jsx
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { drift } from "../data/mock";
import { StatTile } from "../components/stat-tile";
import { Panel } from "../components/panel";
import { SeverityBadge } from "../components/badge";
import { Button } from "../components/button";
import { useStore } from "../store/ui";

export default function Health() {
  const { notify } = useStore();
  const d = drift;
  const isWarning = d.status !== "STABLE";

  const barData = [
    { name: "Stable",  value: d.feature_drift.stable,  fill: "#2ec878" },
    { name: "Drifted", value: d.feature_drift.drifted, fill: "#e8414a" },
  ];

  return (
    <div className="p-6 flex flex-col gap-5 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Model Health</h1>
        <p className="text-[11px] text-ink-muted mt-1">
          drift_monitor.py · Sliding window: last {d.window_size} scans
        </p>
      </div>

      {/* Status banner */}
      <div className={`
        border rounded-xl px-5 py-4 flex items-center gap-4
        ${isWarning ? "bg-warn-dim border-warn-mid" : "bg-safe-dim border-safe-mid"}
      `}>
        <span className="text-3xl">{isWarning ? "⚡" : "✓"}</span>
        <div>
          <p className={`font-display text-lg font-bold ${isWarning ? "text-warn" : "text-safe"}`}>
            {d.status}
          </p>
          <p className="text-[11px] text-ink-muted mt-0.5">
            Total scans: {d.total_scans.toLocaleString()} · Alerts raised: {d.alerts_raised}
          </p>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile
          label="Feature Drift"
          value={`${d.feature_drift.drifted}/${d.feature_drift.total}`}
          sub="features drifted from baseline"
          color="threat" icon="⌬"
        />
        <StatTile
          label="Prediction Shift"
          value={`+${d.prediction_drift.shift}%`}
          sub={`${d.prediction_drift.baseline_malware_rate}% → ${d.prediction_drift.current_malware_rate}%`}
          color="warn" icon="⬡"
        />
        <StatTile
          label="Avg Confidence"
          value={`${d.avg_confidence}%`}
          sub="across last 100 scans"
          color="info" icon="◈"
        />
      </div>

      {/* Alert cards */}
      {d.alerts.map((a, i) => (
        <div key={i} className={`
          border rounded-xl p-4
          ${a.severity === "HIGH" ? "bg-threat-dim border-threat-mid" : "bg-warn-dim border-warn-mid"}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[11px] font-semibold ${a.severity === "HIGH" ? "text-threat" : "text-warn"}`}>
              {a.type}
            </span>
            <SeverityBadge severity={a.severity} />
          </div>
          <p className="text-[12px] text-ink-muted mb-1">{a.message}</p>
          <p className="text-[11px] text-ink-dim">→ {a.recommendation}</p>
        </div>
      ))}

      {/* Charts row */}
      <div className="grid grid-cols-[220px_1fr] gap-4">
        <Panel title="Feature stability" className="h-55">
          <div className="h-[calc(100%-44px)] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barCategoryGap="35%">
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#5e7a96", fontFamily: "JetBrains Mono" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#3a5068", fontFamily: "JetBrains Mono" }}
                  axisLine={false} tickLine={false}
                />
                <Bar dataKey="value" radius={4}>
                  {barData.map((e, i) => <Cell key={i} fill={e.fill} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Prediction rate — baseline vs current" className="h-55">
          <div className="p-5 h-[calc(100%-44px)] flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-raised border border-edge rounded-xl p-4">
                <p className="text-[9px] text-ink-dim tracking-widest uppercase mb-2">Baseline Rate</p>
                <p className="font-display text-3xl font-extrabold text-ink-muted">
                  {d.prediction_drift.baseline_malware_rate}%
                </p>
                <p className="text-[10px] text-ink-dim mt-1">Training distribution</p>
              </div>
              <div className="bg-warn-dim border border-warn-mid rounded-xl p-4">
                <p className="text-[9px] text-warn tracking-widest uppercase mb-2">Current Rate</p>
                <p className="font-display text-3xl font-extrabold text-warn">
                  {d.prediction_drift.current_malware_rate}%
                </p>
                <p className="text-[10px] text-ink-muted mt-1">
                  +{d.prediction_drift.shift}% shift detected
                </p>
              </div>
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Detection rate shifted{" "}
              <strong className="text-warn">+{d.prediction_drift.shift}%</strong>{" "}
              above EMBER training baseline — exceeds the 15% PREDICTION_DRIFT_THRESHOLD.
              Consider retraining or reviewing for false positives.
            </p>
          </div>
        </Panel>
      </div>

      {/* Retrain CTA */}
      <div className="bg-card border border-edge rounded-xl p-5 flex justify-between items-center">
        <div>
          <p className="text-[13px] font-semibold text-ink-primary mb-1">
            Initiate model retraining pipeline
          </p>
          <p className="text-[11px] text-ink-muted">
            Triggers train_model.py with recent scan data appended to EMBER dataset
          </p>
        </div>
        <Button
          variant="warning"
          size="lg"
          onClick={() => notify({
            type: "warning",
            title: "Retraining queued",
            message: "train_model.py will run with recent scans appended.",
          })}
        >
          ⌬ Retrain Model
        </Button>
      </div>
    </div>
  );
}
