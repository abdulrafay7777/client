// src/components/button.jsx

import { FiLoader } from "react-icons/fi";
import { forwardRef } from "react";

const variants = {
  default:  "bg-raised border-edge-hi text-ink-muted hover:text-ink-primary hover:border-edge",
  primary:  "bg-info-dim border-info-mid text-info hover:opacity-90",
  danger:   "bg-threat-dim border-threat-mid text-threat hover:opacity-90",
  warning:  "bg-warn-dim border-warn-mid text-warn hover:opacity-90",
  success:  "bg-safe-dim border-safe-mid text-safe hover:opacity-90",
};

const sizes = {
  sm: "text-[12px] px-3 min-h-10",
  md: "text-[13px] px-4 min-h-10",
  lg: "text-[14px] px-5 min-h-11",
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = "default",
    size = "md",
    onClick,
    disabled,
    loading,
    fullWidth,
    className = "",
    type = "button",
  },
  ref
) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      ref={ref}
      className={`
        ${variants[variant]} ${sizes[size]}
        border rounded-xl font-mono font-semibold tracking-wide
        transition-all duration-150 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        inline-flex items-center gap-1.5
        justify-center
        active:translate-y-px
        ${loading ? "opacity-80" : ""}
        ${fullWidth ? "w-full justify-center" : ""}
        ${className}
      `}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center w-full">
          <FiLoader className="animate-spin text-[18px]" aria-label="Loading" />
        </span>
      ) : (
        children
      )}
    </button>
  );
});
