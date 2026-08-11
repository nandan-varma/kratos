"use client"

export function Checkbox({
  checked,
  mixed = false,
  onChange,
  label,
}: {
  checked: boolean
  mixed?: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center" title={label}>
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} className="sr-only" />
      <span
        className={`flex size-4 items-center justify-center rounded-[5px] text-canvas transition-colors duration-200 ${
          checked || mixed ? "bg-ink" : "shadow-[inset_0_0_0_1.5px_var(--line-strong)]"
        }`}
      >
        {mixed ? (
          <span className="h-[1.5px] w-2 rounded-full bg-canvas" />
        ) : checked ? (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 4 4L19 6" />
          </svg>
        ) : null}
      </span>
    </label>
  )
}
