// src/components/shap-chart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Panel } from "./panel";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-raised border border-edge-hi rounded-lg p-3 text-[13px] max-w-80">
      <p className="font-semibold text-ink-primary mb-1 font-mono">{d.feature}</p>
      <p className="text-ink-muted text-[12px] mb-2 leading-relaxed">{d.description}</p>
      <p className={d.shap_value > 0 ? "text-threat" : "text-safe"}>
        SHAP: {d.shap_value > 0 ? "+" : ""}{d.shap_value.toFixed(3)} → {d.direction}
      </p>
    </div>
  );
}

export function ShapChart({ features = [], className = "" }) {
  const maxAbs = Math.max(0.25, ...features.map((f) => Math.abs(f.shap_value ?? 0)));
  const domain = [-maxAbs * 1.15, maxAbs * 1.15];

  return (
    <Panel title="SHAP feature importance" className={className}>
      <div className="p-4 h-[calc(100%-44px)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={features} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis
              type="number"
              domain={domain}
              tick={{ fontSize: 12, fill: "var(--color-t-dim)", fontFamily: "JetBrains Mono" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              type="category" dataKey="feature" width={190}
              tick={{ fontSize: 12, fill: "var(--color-t-secondary)", fontFamily: "JetBrains Mono" }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <ReferenceLine x={0} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
            <Bar dataKey="shap_value" radius={2}>
              {features.map((entry, i) => (
                <Cell
                  key={i}
                  fill={(entry.shap_value ?? 0) > 0 ? "var(--color-threat)" : "var(--color-safe)"}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
