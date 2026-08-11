import { Button } from "@/components/preview/button"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card bg-surface px-6 py-10 shadow-card">
      <span className="flex size-8 items-center justify-center rounded-control bg-inset text-ink-3 shadow-hairline">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </span>
      <div className="space-y-0.5 text-center">
        <p className="text-[13px] font-medium text-ink">Nothing here yet</p>
        <p className="text-[12.5px] text-ink-3">Get started by creating your first item.</p>
      </div>
      <Button size="sm">Create item</Button>
    </div>
  )
}
