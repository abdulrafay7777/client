// src/pages/history.jsx
import { scans } from "../data/mock";
import { ScanTable } from "../components/scan-table";

export default function History() {
  return (
    <div className="p-6 flex flex-col gap-5 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Scan History</h1>
        <p className="text-[11px] text-ink-muted mt-1">
          All scans — filter by zone or search by filename
        </p>
      </div>
      <ScanTable scans={scans} />
    </div>
  );
}
