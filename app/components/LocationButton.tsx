import React from "react";

type LocationButtonProps = {
  label: string;
  subLabel?: string;
  /** alignment of the content inside the box; default is 'right' */
  align?: "left" | "right";
  /** compact mode uses the smaller/uppercase date-style typography */
  compact?: boolean;
};

export default function LocationButton({
  label,
  subLabel,
  align = "right",
  compact = false,
}: LocationButtonProps) {
  const containerAlignClass = align === "left" ? "text-left" : "text-right";
  const mainLabelClass = compact
    ? "font-geist-sans text-neutral-600/85 tracking-widest uppercase text-sm md:text-base"
    : "font-geist-sans text-neutral-900 text-3xl md:text-6xl leading-tight";

  return (
    <div
      className={`bg-white opacity-95 border border-neutral-200 rounded-2xl px-6 py-4 md:px-8 md:py-6 max-w-3xl ${containerAlignClass}`}
    >
      <div className={mainLabelClass}>{label}</div>
      {subLabel && (
        <div className="text-[10px] md:text-xs text-neutral-500/70 mt-2">
          {subLabel}
        </div>
      )}
    </div>
  );
}
