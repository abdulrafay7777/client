// src/data/mock.js

export const scans = [
  {
    id: "s1",
    filename: "setup_crack.exe",
    filepath: "C:\\Users\\Downloads\\setup_crack.exe",
    zone: "MALWARE",
    probability: 94.2,
    minsAgo: 3,
    reviewed: false,
    top_features: [
      { feature: "byteent_240", description: "Max entropy — encrypted/packed",   shap_value:  0.451, direction: "MALWARE" },
      { feature: "byteent_232", description: "High entropy packer signature",     shap_value:  0.312, direction: "MALWARE" },
      { feature: "dd_2_size",   description: "Import table hidden (size=0)",     shap_value:  0.201, direction: "MALWARE" },
      { feature: "hist_233",    description: "JMP instruction — suspicious",     shap_value:  0.178, direction: "MALWARE" },
      { feature: "str_entropy", description: "String entropy high",              shap_value:  0.134, direction: "MALWARE" },
      { feature: "hist_232",    description: "CALL instruction frequency",       shap_value: -0.089, direction: "BENIGN"  },
      { feature: "gen_size",    description: "File size normal",                 shap_value: -0.067, direction: "BENIGN"  },
      { feature: "hist_139",    description: "MOV instruction (clean pattern)",  shap_value: -0.045, direction: "BENIGN"  },
    ],
    threat_behaviors: [
      { label: "Encrypted / Packed Payload", strength: 0.451 },
      { label: "Import Table Manipulation",  strength: 0.201 },
      { label: "String Obfuscation",         strength: 0.134 },
    ],
  },
  {
    id: "s2",
    filename: "notepad.exe",
    filepath: "C:\\Windows\\System32\\notepad.exe",
    zone: "SAFE",
    probability: 4.1,
    minsAgo: 12,
    reviewed: false,
    top_features: [
      { feature: "hist_139", description: "MOV instruction normal code",  shap_value: -0.234, direction: "BENIGN" },
      { feature: "gen_size", description: "Normal file size range",       shap_value: -0.189, direction: "BENIGN" },
      { feature: "hist_232", description: "CALL instruction frequency",   shap_value: -0.145, direction: "BENIGN" },
    ],
    threat_behaviors: [],
  },
  {
    id: "s3",
    filename: "updater_v2.exe",
    filepath: "C:\\Temp\\updater_v2.exe",
    zone: "SUSPICIOUS",
    probability: 51.7,
    minsAgo: 20,
    reviewed: false,
    top_features: [
      { feature: "byteent_160", description: "Compressed code patterns",  shap_value:  0.142, direction: "MALWARE" },
      { feature: "hist_233",    description: "JMP instruction elevated",  shap_value:  0.098, direction: "MALWARE" },
      { feature: "hist_139",    description: "MOV instruction normal",    shap_value: -0.112, direction: "BENIGN"  },
    ],
    threat_behaviors: [{ label: "Binary Packing / Compression", strength: 0.142 }],
  },
  {
    id: "s4",
    filename: "cmd.exe",
    filepath: "C:\\Windows\\System32\\cmd.exe",
    zone: "SAFE",
    probability: 8.3,
    minsAgo: 55,
    reviewed: true,
    top_features: [
      { feature: "hist_139", description: "MOV instruction normal", shap_value: -0.198, direction: "BENIGN" },
    ],
    threat_behaviors: [],
  },
  {
    id: "s5",
    filename: "invoice_doc.exe",
    filepath: "C:\\Downloads\\invoice_doc.exe",
    zone: "MALWARE",
    probability: 88.6,
    minsAgo: 60,
    reviewed: false,
    top_features: [
      { feature: "byteent_240", description: "Max entropy encrypted", shap_value:  0.380, direction: "MALWARE" },
      { feature: "dd_2_size",   description: "Import table hidden",   shap_value:  0.245, direction: "MALWARE" },
      { feature: "hist_233",    description: "JMP instruction high",  shap_value:  0.198, direction: "MALWARE" },
    ],
    threat_behaviors: [
      { label: "Encrypted / Packed Payload", strength: 0.380 },
      { label: "Import Table Manipulation",  strength: 0.245 },
    ],
  },
];

export const drift = {
  status: "WARNING",
  total_scans: 1847,
  window_size: 100,
  alerts_raised: 3,
  feature_drift:    { stable: 41, drifted: 6, total: 47 },
  prediction_drift: { baseline: 22.4, current: 31.7, shift: 9.3 },
  avg_confidence:   76.4,
  alerts: [
    {
      type: "PREDICTION_DRIFT", severity: "MEDIUM",
      message: "Model detecting MORE malware than expected (31.7% vs baseline 22.4%)",
      recommendation: "Review recent scan results for false positives",
    },
  ],
};

export const timeline = Array.from({ length: 14 }, (_, i) => {
  const d = new Date("2026-03-06");
  d.setDate(d.getDate() + i);
  return {
    day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    malware:    Math.floor(Math.random() * 6)  + 1,
    suspicious: Math.floor(Math.random() * 3)  + 1,
    safe:       Math.floor(Math.random() * 16) + 6,
  };
});

export const behaviors = [
  { label: "Encrypted Payload",  strength: 0.38, fullMark: 0.5 },
  { label: "Packing",            strength: 0.20, fullMark: 0.5 },
  { label: "Code Injection",     strength: 0.27, fullMark: 0.5 },
  { label: "Import Hiding",      strength: 0.24, fullMark: 0.5 },
  { label: "String Obfuscation", strength: 0.13, fullMark: 0.5 },
  { label: "Size Anomaly",       strength: 0.05, fullMark: 0.5 },
];

export const claudeExplanation =
  "This executable exhibits strong indicators of malware. SHAP analysis reveals byte-entropy features (byteent_240, byteent_232) as primary drivers — both in the 230-240 entropy range, characteristic of UPX or custom-packed payloads designed to evade static analysis. Import table size (dd_2_size = 0) indicates all imports resolved dynamically at runtime — a classic anti-analysis technique. High JMP frequency (hist_233) with near-zero CALL frequency suggests a shellcode stub or stage-1 dropper. Recommend immediate quarantine and sandbox detonation. MITRE ATT&CK: T1027 (Obfuscated Files), T1140 (Deobfuscation).";
