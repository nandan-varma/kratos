/**
 * DOT
 * A small colored indicator dot. Use for status markers, filter
 * indicators, and compact list embellishments.
 *
 * Usage:
 *   <Dot color="var(--green)" />
 *   <Dot className="bg-accent" />
 */

export function Dot({ color, className }: { color?: string; className?: string }) {
  return (
    <span
      className={`size-1.5 shrink-0 rounded-full ${className ?? ""}`}
      style={color ? { background: color } : undefined}
    />
  )
}
