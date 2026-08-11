export function Dot({ color, className }: { color?: string; className?: string }) {
  return (
    <span
      className={`size-1.5 shrink-0 rounded-full ${className ?? ""}`}
      style={color ? { background: color } : undefined}
    />
  )
}
