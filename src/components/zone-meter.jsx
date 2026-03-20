// src/components/zone-meter.jsx
export function ZoneMeter({ probability }) {
  const pct = Math.min(Math.max(probability, 0), 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-[9px] text-ink-dim mb-1">
        <span>0%</span><span>30%</span><span>70%</span><span>100%</span>
      </div>
      <div className="relative h-2 rounded-full bg-lift overflow-hidden">
        <div className="absolute left-0 w-[30%] h-full bg-safe   opacity-40" />
        <div className="absolute left-[30%] w-[40%] h-full bg-warn  opacity-40" />
        <div className="absolute left-[70%] w-[30%] h-full bg-threat opacity-40" />
        {/* Cursor */}
        <div
          className="absolute -top-px w-0.5 h-2.5 bg-white rounded-sm transition-all duration-700"
          style={{ left: `calc(${pct}% - 1px)` }}
        />
      </div>
      <div className="flex justify-between text-[9px] mt-1">
        <span className="text-safe">SAFE</span>
        <span className="text-warn">SUSPICIOUS</span>
        <span className="text-threat">MALWARE</span>
      </div>
    </div>
  );
}
