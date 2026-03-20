import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function Popover({
  open,
  anchorRef,
  onClose,
  children,
  minWidth = 200,
  offset = 8,
  placement = "bottom-start",
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: minWidth });

  const compute = useMemo(() => {
    return () => {
      const a = anchorRef?.current;
      if (!a) return;
      const r = a.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const width = Math.max(minWidth, r.width);
      let left = r.left;
      let top = r.bottom + offset;

      if (placement === "bottom-end") left = r.right - width;
      if (placement === "top-start") top = r.top - offset;
      if (placement === "top-end") {
        left = r.right - width;
        top = r.top - offset;
      }

      left = clamp(left, 12, vw - width - 12);
      top = clamp(top, 12, vh - 12);

      setPos({ top, left, width });
    };
  }, [anchorRef, minWidth, offset, placement]);

  useLayoutEffect(() => {
    if (!open) return;
    const raf = window.requestAnimationFrame(() => compute());
    return () => window.cancelAnimationFrame(raf);
  }, [open, compute]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    const onPointerDown = (e) => {
      const panel = panelRef.current;
      const anchor = anchorRef?.current;
      if (!panel || !anchor) return;
      if (panel.contains(e.target) || anchor.contains(e.target)) return;
      onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [open, onClose, compute, anchorRef]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      ref={panelRef}
      className="fixed z-50"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
      role="menu"
    >
      <div className="bg-raised border border-edge-hi rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.45)] overflow-hidden">
        {children}
      </div>
    </div>,
    document.body
  );
}

