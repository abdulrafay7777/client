// src/components/behavior-radar.jsx
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Panel } from "./panel";

export function BehaviorRadar({ data = [], className = "" }) {
  return (
    <Panel title="Threat behavior profile" className={className}>
      <div className="h-[calc(100%-44px)] py-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="#1f2d3f" />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "#5e7a96", fontFamily: "JetBrains Mono" }}
            />
            <PolarRadiusAxis
              angle={30} domain={[0, 0.5]} tickCount={3}
              tick={{ fontSize: 9, fill: "#3a5068", fontFamily: "JetBrains Mono" }}
            />
            <Tooltip
              contentStyle={{
                background: "#161e2a", border: "1px solid #2a3e57",
                borderRadius: 8, fontSize: 11, fontFamily: "JetBrains Mono",
              }}
              formatter={(v) => [v.toFixed(3), "strength"]}
            />
            <Radar
              name="Threat" dataKey="strength"
              stroke="#e8414a" fill="#e8414a" fillOpacity={0.12} strokeWidth={1.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
