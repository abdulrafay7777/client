// src/pages/scan.jsx
import { useState, useRef, useCallback } from "react";
import { FiActivity, FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiCpu, FiUploadCloud, FiZap } from "react-icons/fi";
import { scans, claudeExplanation } from "../data/mock";
import { ZoneBadge } from "../components/badge";
import { Button } from "../components/button";
import { ZoneMeter } from "../components/zone-meter";
import { ShapChart } from "../components/shap-chart";
import { Panel } from "../components/panel";

const STEPS = [
  "PE header extraction (scanner.py)",
  "Byte-entropy histogram analysis",
  "EMBER ensemble model inference",
  "SHAP KernelExplainer (nsamples=100)",
  "Tri-zone classification + Claude",
];

const SAMPLES = [
  { name: "invoice_final.exe",   idx: 0 },
  { name: "setup_v2.exe",        idx: 1 },
  { name: "updater_patch.exe",   idx: 2 },
];

// ─── Sub-view: scanning progress ────────────────────────────────────────────
function ScanProgress({ filename, progress }) {
  const activeStep = Math.floor((progress / 100) * STEPS.length);
  return (
    <div className="p-6 flex flex-col gap-5 animate-fade-up">
      <h1 className="font-display text-xl font-extrabold tracking-tight">
        Scanning — <span className="text-info">{filename}</span>
      </h1>
      <div className="bg-card border border-edge rounded-xl p-7">
        {/* Bar */}
        <div className="h-1 bg-lift rounded-full overflow-hidden mb-7">
          <div
            className="h-full bg-info rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Steps */}
        <div className="flex flex-col gap-3">
          {STEPS.map((label, i) => {
            const done   = i < activeStep;
            const active = i === activeStep;
            return (
              <div key={label} className="flex items-center gap-3">
                <div className={`
                  w-5 h-5 rounded-full shrink-0 grid place-items-center text-[10px] font-bold
                  ${done   ? "bg-safe text-base"              : ""}
                  ${active ? "bg-info-dim border-2 border-info" : ""}
                  ${!done && !active ? "bg-lift"              : ""}
                `}>
                  {done && <FiCheckCircle className="text-base" />}
                </div>
                <span className={`text-[12px] ${done ? "text-safe" : active ? "text-ink-primary" : "text-ink-dim"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-ink-dim mt-5">{Math.round(progress)}% complete</p>
      </div>
    </div>
  );
}

// ─── Sub-view: scan result ───────────────────────────────────────────────────
function ScanResult({ result, filename, onReset }) {
  const [claude, setClaude] = useState("");
  const [done, setDone]     = useState(false);

  // Stream Claude text on first render
  useState(() => {
    let i = 0;
    const iv = setInterval(() => {
      i += 4;
      setClaude(claudeExplanation.slice(0, i));
      if (i >= claudeExplanation.length) { clearInterval(iv); setDone(true); }
    }, 16);
    return () => clearInterval(iv);
  });

  const zoneTextColor  = { MALWARE: "text-threat",  SUSPICIOUS: "text-warn",  SAFE: "text-safe"  }[result.zone];
  const zoneBgBorder   = { MALWARE: "bg-threat-dim border-threat/30", SUSPICIOUS: "bg-warn-dim border-warn/30", SAFE: "bg-safe-dim border-safe/30" }[result.zone];
  const ZoneIcon = { MALWARE: FiAlertTriangle, SUSPICIOUS: FiAlertCircle, SAFE: FiCheckCircle }[result.zone] ?? FiAlertCircle;

  return (
    <div className="p-6 flex flex-col gap-5 animate-fade-up">
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <h1 className="font-display text-xl font-extrabold tracking-tight">
          Scan Complete — <span className="text-ink-muted font-mono text-base">{filename}</span>
        </h1>
        <Button variant="default" size="sm" onClick={onReset}>← Scan Another</Button>
      </div>

      {/* Verdict hero */}
      <div className={`${zoneBgBorder} border rounded-xl p-6 flex items-center gap-7`}>
        <span className="text-5xl">
          <ZoneIcon className={zoneTextColor} />
        </span>
        <div>
          <p className="text-[10px] text-ink-muted tracking-widest uppercase mb-1">Classification</p>
          <p className={`font-display text-4xl font-extrabold leading-none ${zoneTextColor}`}>{result.zone}</p>
          <p className="text-[12px] text-ink-muted mt-2">{result.zone_action}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[10px] text-ink-muted tracking-widest uppercase mb-1">Malware Probability</p>
          <p className={`font-display text-5xl font-extrabold leading-none ${zoneTextColor}`}>
            {result.malware_probability}%
          </p>
          <div className="mt-3 w-60">
            <ZoneMeter probability={result.malware_probability} />
          </div>
        </div>
      </div>

      {/* SHAP + Claude */}
      <div className="grid grid-cols-2 gap-4">
        <ShapChart features={result.top_features} className="h-85" />

        <Panel title="Claude AI · SOC Analyst" className="h-85">
          <div className="p-4 h-[calc(100%-44px)] flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-info-dim border border-info-mid grid place-items-center text-[11px]">
                <FiZap className="text-info" />
              </div>
              <span className="text-[11px] text-info">claude-sonnet-4-20250514</span>
            </div>
            <p className="text-[12px] leading-relaxed text-ink-muted flex-1 overflow-y-auto">
              {claude}
              {!done && <span className="animate-blink text-info">▋</span>}
            </p>
            {result.threat_behaviors.length > 0 && (
              <div className="border-t border-edge pt-3">
                <p className="text-[9px] text-ink-dim tracking-widest uppercase mb-2">Detected Behaviors</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.threat_behaviors.map((b, i) => (
                    <span key={i} className="bg-threat-dim border border-threat-mid text-threat text-[10px] px-2 py-0.5 rounded">
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ─── Main scan page ──────────────────────────────────────────────────────────
export default function Scan() {
  const [phase,    setPhase]    = useState("idle");
  const [filename, setFilename] = useState("");
  const [progress, setProgress] = useState(0);
  const [result,   setResult]   = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [starting, setStarting] = useState(false);
  const fileRef = useRef();

  const startScan = useCallback((name, scanIdx = 0) => {
    if (starting) return;
    setStarting(true);
    setFilename(name);
    setPhase("scanning");
    setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 14 + 4;
      if (p >= 100) {
        clearInterval(iv);
        setProgress(100);
        setTimeout(() => { setResult(scans[scanIdx]); setPhase("result"); setStarting(false); }, 300);
      } else {
        setProgress(p);
      }
    }, 120);
  }, [starting]);

  if (phase === "result" && result) {
    return <ScanResult result={result} filename={filename} onReset={() => { setPhase("idle"); setResult(null); }} />;
  }
  if (phase === "scanning") {
    return <ScanProgress filename={filename} progress={progress} />;
  }

  return (
    <div className="p-6 flex flex-col gap-5 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Scan Executable File</h1>
        <p className="text-[11px] text-ink-muted mt-1">
          Upload a PE/EXE — scanner.py extracts EMBER features, model classifies, SHAP explains
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          if (starting) return;
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) startScan(f.name, 0);
        }}
        onClick={() => !starting && fileRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-14 text-center cursor-pointer transition-all duration-200
          ${dragOver ? "border-info bg-info-dim" : "border-edge-hi bg-card hover:border-info/50"}
          ${starting ? "opacity-70 cursor-not-allowed" : ""}
        `}
      >
        <input ref={fileRef} type="file" className="hidden"
          onChange={(e) => !starting && e.target.files[0] && startScan(e.target.files[0].name, 0)} />
        <div className="mb-4 flex justify-center">
          <FiUploadCloud className="text-5xl opacity-60" />
        </div>
        <p className="font-display text-lg font-bold text-ink-primary mb-2">Drop executable here</p>
        <p className="text-[12px] text-ink-muted">.exe · .dll · .bin · .sys — or click to browse</p>
      </div>

      {/* Quick samples */}
      <div className="bg-card border border-edge rounded-xl p-5">
        <p className="text-[10px] text-ink-muted tracking-widest uppercase mb-3">Quick Test Samples</p>
        <div className="flex gap-3 flex-wrap">
          {SAMPLES.map((s) => (
            <Button key={s.name} variant="default" loading={starting && filename === s.name} disabled={starting} onClick={() => startScan(s.name, s.idx)}>
              {s.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Pipeline info cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: FiCpu, title: "scanner.py",   desc: "Extracts 2,381 PE features: byte-entropy histograms, opcode frequencies, PE header metadata" },
          { icon: FiActivity, title: "explainer.py", desc: "SHAP KernelExplainer on stacking ensemble. Tri-zone: SAFE / SUSPICIOUS / MALWARE" },
          { icon: FiZap,      title: "Claude API",   desc: "Receives SHAP values + threat behaviors → SOC analyst-grade incident explanation" },
        ].map((item) => (
          <div key={item.title} className="bg-card border border-edge rounded-xl p-4">
            <div className="mb-3 opacity-70">
              <item.icon className="text-2xl" />
            </div>
            <p className="text-[12px] font-semibold text-ink-primary mb-2">{item.title}</p>
            <p className="text-[11px] text-ink-muted leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
