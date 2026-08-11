export function Tag({ name, color }: { name: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-inset px-1.5 py-0.5 text-[11px] text-ink-2 shadow-hairline">
      <span className="size-1.5 shrink-0 rounded-full" style={{ background: color }} />
      {name}
    </span>
  )
}
