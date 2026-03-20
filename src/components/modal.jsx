import { useEffect } from "react";
import ReactDOM from "react-dom";

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  role = "dialog",
  widthClass = "w-[min(92vw,520px)]",
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-[rgba(15,23,42,0.80)] backdrop-blur-xs"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div
          className={`${widthClass} bg-card border border-edge-hi rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.50)]`}
          role={role}
          aria-modal="true"
          aria-label={typeof title === "string" ? title : undefined}
        >
          <div className="px-6 pt-6">
            {title && (
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[20px] font-bold text-ink-primary leading-tight">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-10 min-w-10 rounded-xl bg-raised border border-edge-hi text-ink-muted hover:text-ink-primary grid place-items-center"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <div className="px-6 pb-6 pt-4 text-[16px] leading-normal text-ink-muted">
            {children}
          </div>
          {footer && (
            <div className="px-6 py-5 border-t border-edge flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

