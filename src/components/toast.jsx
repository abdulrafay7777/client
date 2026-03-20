// src/components/toast.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../store/ui";

const typeStyles = {
  success: "border-safe text-safe bg-safe-dim",
  error:   "border-threat text-threat bg-threat-dim",
  warning: "border-warn text-warn bg-warn-dim",
  info:    "border-info text-info bg-info-dim",
};

function ToastItem({ toast, onDismiss }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const remainingRef = useRef(toast.duration ?? 4000);
  const timerRef = useRef(null);
  const startedAtRef = useRef(null);

  const style = useMemo(() => typeStyles[toast.type] || typeStyles.info, [toast.type]);

  useEffect(() => {
    // trigger slide-in after mount
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const start = () => {
      startedAtRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onDismiss(toast.id), 160);
      }, remainingRef.current);
    };
    const stop = () => {
      if (!timerRef.current) return;
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (startedAtRef.current) {
        remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current));
      }
      startedAtRef.current = null;
    };

    if (hovered) stop();
    else start();

    return () => stop();
  }, [hovered, toast.id, onDismiss]);

  return (
    <div
      className={`
        border-l-4 border border-edge-hi ${style}
        rounded-xl px-4 py-3 min-w-[300px] max-w-sm pointer-events-auto
        shadow-[0_16px_48px_rgba(0,0,0,0.45)]
        transition-all duration-200
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between items-start gap-3">
        <span className="text-[14px] font-semibold text-ink-primary">{toast.title}</span>
        <button
          onClick={() => onDismiss(toast.id)}
          className="min-h-10 min-w-10 rounded-xl bg-raised/40 border border-edge-hi text-ink-muted hover:text-ink-primary grid place-items-center -mr-1 -mt-1"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
      {toast.message && (
        <p className="text-[13px] text-ink-muted mt-1 leading-relaxed">{toast.message}</p>
      )}
    </div>
  );
}

export function ToastStack() {
  const { toasts, dismissToast } = useStore();
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />
      ))}
    </div>
  );
}
