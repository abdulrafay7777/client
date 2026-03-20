// src/pages/queue.jsx
import { useState } from "react";
import { scans } from "../data/mock";
import { ZoneBadge } from "../components/badge";
import { Button } from "../components/button";
import { ZoneMeter } from "../components/zone-meter";
import { useStore } from "../store/ui";
import { Modal } from "../components/modal";

export default function Queue() {
  const queue = scans.filter((s) => s.zone === "SUSPICIOUS");
  const [decisions, setDecisions] = useState({});
  const [confirm, setConfirm] = useState(null); // { id, decision, filepath }
  const [busyId, setBusyId] = useState(null);
  const [aiBusyId, setAiBusyId] = useState(null);
  const { notify } = useStore();

  const decide = (id, decision) => {
    setDecisions((d) => ({ ...d, [id]: decision }));
    notify({
      type:    decision === "malware" ? "error" : "success",
      title:   decision === "malware" ? "Confirmed as Malware" : "Marked as Safe",
      message: `File has been ${decision === "malware" ? "quarantined" : "cleared"}.`,
    });
  };

  const pending = queue.filter((s) => !decisions[s.id]);

  return (
    <>
      <div className="p-6 flex flex-col gap-6 animate-fade-up">
        {/* Header */}
        <div className="mb-2">
          {/* Increased header size for better hierarchy */}
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Analyst Review Queue</h1>
          {/* Increased from 11px to 16px (text-base) for readability */}
          <p className="text-base text-ink-muted mt-2">
            SUSPICIOUS zone files (30–70% malware probability) require human classification.
            {pending.length > 0 && (
              <span className="text-warn ml-2 font-semibold">{pending.length} pending</span>
            )}
          </p>
        </div>

      {/* Queue items */}
      {queue.map((s) => {
        const decision = decisions[s.id];
        return (
          <div
            key={s.id}
            className={`
              border rounded-xl p-6 transition-all duration-300
              ${decision ? "bg-card border-edge opacity-50" : "bg-warn-dim border-warn-mid"}
            `}
          >
            {/* Title row */}
            <div className="flex justify-between items-start mb-5">
              <div>
                {/* Increased from text-base to text-xl and made monospace for file paths */}
                <p className="font-mono text-xl font-bold text-ink-primary">{s.filepath}</p>
                {/* Increased from 11px to 14px (text-sm) */}
                <p className="text-sm text-ink-muted mt-2">
                  Scanned {new Date(s.timestamp).toLocaleString()}
                  &nbsp;·&nbsp;
                  <span className="text-warn font-bold">{s.malware_probability}% malware probability</span>
                </p>
              </div>
              <ZoneBadge zone={s.zone} />
            </div>

            {/* Zone meter */}
            <div className="mb-6">
              <ZoneMeter probability={s.malware_probability} />
            </div>

            {/* Behaviors */}
            {s.threat_behaviors.length > 0 && (
              <div className="mb-6">
                {/* Increased from 9px to 12px (text-xs) */}
                <p className="text-xs font-semibold text-ink-dim tracking-widest uppercase mb-3">Detected Behaviors</p>
                <div className="flex gap-2 flex-wrap">
                  {s.threat_behaviors.map((b, i) => (
                    // Increased tag size from 10px to 12px and added more padding
                    <span key={i} className="bg-lift border border-edge-hi text-warn text-xs px-3 py-1.5 rounded-md font-medium">
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {!decision ? (
              <div className="flex gap-4 mt-2">
                <Button
                  variant="danger"
                  loading={busyId === s.id}
                  onClick={() => setConfirm({ id: s.id, decision: "malware", filepath: s.filepath })}
                >
                  Confirm Malware
                </Button>
                <Button
                  variant="success"
                  loading={busyId === s.id}
                  onClick={() => setConfirm({ id: s.id, decision: "safe", filepath: s.filepath })}
                >
                  Mark as Safe
                </Button>
                <Button
                  variant="primary"
                  loading={aiBusyId === s.id}
                  onClick={() => {
                    setAiBusyId(s.id);
                    notify({ type: "info", title: "AI requested", message: "Generating SOC analyst explanation…" });
                    setTimeout(() => setAiBusyId(null), 900);
                  }}
                >
                  Ask AI
                </Button>
              </div>
            ) : (
              // Increased from 12px to 14px (text-sm)
              <p className={`text-sm font-bold mt-2 ${decision === "malware" ? "text-threat" : "text-safe"}`}>
                ✓ Marked as {decision === "malware" ? "MALWARE — quarantined" : "SAFE — allowed"}
              </p>
            )}
          </div>
        );
      })}

        {/* Empty state */}
        {queue.length === 0 && (
          <div className="text-center py-20 text-ink-dim">
            <p className="text-4xl mb-4">✓</p>
            {/* Increased from text-sm to text-base */}
            <p className="text-base font-medium">Queue is clear — no files awaiting review</p>
          </div>
        )}
      </div>

      <Modal
      open={!!confirm}
      title={confirm?.decision === "malware" ? "Quarantine this file?" : "Mark this file as safe?"}
      onClose={() => (busyId ? null : setConfirm(null))}
      footer={
        <>
          <Button variant="default" onClick={() => setConfirm(null)} disabled={!!busyId}>
            Cancel
          </Button>
          <Button
            variant={confirm?.decision === "malware" ? "danger" : "success"}
            loading={!!busyId}
            onClick={() => {
              const c = confirm;
              if (!c) return;
              setBusyId(c.id);
              setTimeout(() => {
                decide(c.id, c.decision);
                setBusyId(null);
                setConfirm(null);
              }, 650);
            }}
          >
            {confirm?.decision === "malware" ? "Quarantine File" : "Confirm Safe"}
          </Button>
        </>
      }
    >
      {/* Explicitly setting text-base for Modal text */}
      <div className="text-base">
        <p className="text-ink-muted mb-4">
          <span className="font-mono text-ink-primary font-semibold break-all">{confirm?.filepath}</span>
        </p>
        <p className="leading-relaxed">
          {confirm?.decision === "malware"
            ? "This will escalate the detection to MALWARE, quarantine the artifact, and notify the SOC workflow."
            : "This will clear the detection and allow the artifact in the baseline set."}
        </p>
      </div>
      </Modal>
    </>
  );
}