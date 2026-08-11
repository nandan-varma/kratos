import { StatusBadge } from "@/components/preview/status-badge";

export function StatusBadgeDemo() {
  return (
    <div className="flex items-center gap-4">
      <StatusBadge tone="green">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </StatusBadge>
      <StatusBadge tone="red">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </StatusBadge>
    </div>
  );
}
