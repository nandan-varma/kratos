/**
 * SHIMMER
 * Animated gradient-sweep text for "in progress" labels. Wraps any
 * text content with the shimmer animation.
 *
 * Usage:
 *   <Shimmer>Improving…</Shimmer>        (ink-to-ink gradient)
 *   <Shimmer variant="accent">Adjust</Shimmer>  (accent-to-accent)
 */

export function Shimmer({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode
  variant?: "default" | "accent"
  className?: string
}) {
  const gradient =
    variant === "accent"
      ? "linear-gradient(90deg, var(--accent) 35%, var(--accent-ink) 50%, var(--accent) 65%)"
      : "linear-gradient(90deg, var(--ink-3) 35%, var(--ink) 50%, var(--ink-3) 65%)"

  return (
    <span
      className={`bg-clip-text text-[12.5px] font-medium text-transparent ${className ?? ""}`}
      style={{
        backgroundImage: gradient,
        backgroundSize: "200% 100%",
        animation: "shimmer-text 1.4s linear infinite",
      }}
    >
      {children}
    </span>
  )
}
