// src/components/panel.jsx
export function Panel({ title, action, children, className = "" }) {
  return (
    <div className={`bg-surface border border-edge rounded-xl overflow-hidden flex flex-col ${className}`}>
      {title && (
        <div className="bg-card border-b border-edge px-5 py-4 flex items-center justify-between shrink-0">
          <span className="text-[12px] font-semibold tracking-widest uppercase text-ink-muted">
            {title}
          </span>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
