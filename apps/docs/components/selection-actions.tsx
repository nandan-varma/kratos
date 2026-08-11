"use client"

import { Check, ChevronRight, MessageCircleQuestion, RefreshCw, Scissors, Smile, Sparkles, Type, X } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

import { Shimmer } from "@/components/preview/shimmer"

/**
 * SELECTION ACTIONS
 * A contextual AI bar attached beneath selected text, with a compact
 * action row that expands, and a thinking -> streaming -> result flow.
 */

const LEAD = "The migration runs nightly at 2am UTC. "
const PICKED = "If it fails twice in a row, page the on-call engineer and roll back automatically."
const REWRITE = "If it fails twice in a row, automatically roll back and page the on-call engineer."

type Mode = "idle" | "thinking" | "streaming" | "result"

function ShimmerLabel({ children }: { children: React.ReactNode }) {
  return <Shimmer>{children}</Shimmer>
}

function StreamedText({ text, onDone }: { text: string; onDone: () => void }) {
  const words = useMemo(() => text.split(" "), [text])
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count >= words.length) {
      onDone()
      return
    }
    const t = setTimeout(() => setCount((c) => c + 1), 55)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, words.length, onDone])

  return <>{words.slice(0, count).join(" ")}</>
}

const control =
  "inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-[12px] font-normal text-ink transition-[background-color,color,transform] duration-150 hover:bg-hover active:scale-[0.96]"

const primary =
  "inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 text-[12.5px] font-normal text-canvas shadow-hairline transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.96]"

export function SelectionActions() {
  const [mode, setMode] = useState<Mode>("idle")
  const [action, setAction] = useState("Improve")
  const [expanded, setExpanded] = useState(false)
  const [anchor, setAnchor] = useState({ x: 0, y: 0 })
  const [positioned, setPositioned] = useState(false)

  const hostRef = useRef<HTMLDivElement>(null)
  const selectionRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (mode !== "thinking") return
    const t = setTimeout(() => setMode("streaming"), 700)
    return () => clearTimeout(t)
  }, [mode])

  const place = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const host = hostRef.current
      const selection = selectionRef.current
      if (!(host && selection)) return

      const lines = Array.from(selection.getClientRects())
      const lastLine = lines.at(-1)
      if (!lastLine) return

      const hostBounds = host.getBoundingClientRect()
      setAnchor({
        x: Math.round(lastLine.left - hostBounds.left + lastLine.width / 2),
        y: Math.round(lastLine.bottom - hostBounds.top + 8),
      })
      setPositioned(true)
    })
  }, [])

  useLayoutEffect(() => {
    place()
  }, [place])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const observer = new ResizeObserver(place)
    observer.observe(host)
    window.addEventListener("resize", place)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", place)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [place])

  const run = (nextAction: string) => {
    setAction(nextAction)
    setExpanded(false)
    setMode("thinking")
  }

  const reset = () => {
    setExpanded(false)
    setAction("Improve")
    setMode("idle")
  }

  const busy = mode === "thinking" || mode === "streaming"
  const visible = positioned
  const busyLabel =
    action === "Improve"
      ? "Improving"
      : action === "Shorten"
        ? "Shortening"
        : action === "Change tone"
          ? "Changing tone"
          : "Editing"

  return (
    <div className="w-full max-w-[460px]">
      <div ref={hostRef} className="relative select-none pb-8">
        <p className="text-[13px] leading-relaxed text-ink">
          {LEAD}
          <span
            ref={selectionRef}
            className="box-decoration-clone rounded-[3px] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] text-ink dark:bg-accent-tint"
          >
            {mode === "idle" || mode === "thinking" ? (
              PICKED
            ) : mode === "streaming" ? (
              <StreamedText text={REWRITE} onDone={() => setMode("result")} />
            ) : (
              REWRITE
            )}
          </span>
        </p>

        <div
          className="absolute top-0 left-0 z-10"
          style={{
            transform: `translate3d(${anchor.x}px, ${anchor.y}px, 0) translateX(-50%)`,
            transition: "transform 320ms cubic-bezier(0.77,0,0.175,1), opacity 180ms ease-out",
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? "auto" : "none",
          }}
        >
          <div
            className="flex h-9 w-fit max-w-[calc(100vw-48px)] items-center justify-center gap-0.5 overflow-hidden rounded-full bg-surface p-1 font-sans text-ink shadow-overlay"
            style={visible ? { animation: "pop-in 220ms cubic-bezier(0.23,1,0.32,1) both" } : {}}
          >
            {busy && (
              <span className="inline-flex h-7 items-center gap-1.5 whitespace-nowrap px-2.5 text-[12.5px] font-normal text-ink-2">
                <span
                  className="size-3 shrink-0 rounded-full border-[1.5px] border-line-strong border-t-ink-2"
                  style={{ animation: "spin 700ms linear infinite" }}
                />
                {mode === "thinking" ? <ShimmerLabel>{busyLabel}…</ShimmerLabel> : <span>{busyLabel}…</span>}
              </span>
            )}

            {mode === "result" && (
              <>
                <button type="button" onClick={reset} className={primary}>
                  <Check width={14} height={14} strokeWidth={1.8} aria-hidden />
                  Keep
                </button>
                <button type="button" onClick={reset} className={control}>
                  <X width={14} height={14} strokeWidth={1.8} aria-hidden />
                  Discard
                </button>
                <span className="mx-0.5 h-4 w-px shrink-0 bg-line" />
                <button
                  type="button"
                  aria-label="Try again"
                  onClick={() => run(action)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-ink-3 transition-[background-color,color,transform] duration-150 hover:bg-hover-2 hover:text-ink-2 active:scale-[0.96]"
                >
                  <RefreshCw width={14} height={14} strokeWidth={1.8} aria-hidden />
                </button>
              </>
            )}

            {mode === "idle" && (
              <div
                className="flex min-w-0 items-center gap-0.5 overflow-hidden transition-[max-width] duration-400"
                style={{ maxWidth: expanded ? 462 : 224, transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)" }}
              >
                <button type="button" className={control}>
                  <MessageCircleQuestion width={14} height={14} strokeWidth={1.8} aria-hidden />
                  Explain
                </button>
                <button type="button" onClick={() => run("Improve")} className={control}>
                  <Sparkles width={14} height={14} strokeWidth={1.8} aria-hidden />
                  Improve
                </button>

                <div
                  className="flex min-w-0 items-center gap-0.5 overflow-hidden transition-[max-width,opacity] duration-400"
                  style={{
                    maxWidth: expanded ? 262 : 0,
                    opacity: expanded ? 1 : 0,
                    transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
                  }}
                >
                  <button type="button" onClick={() => run("Shorten")} className={control}>
                    <Scissors width={14} height={14} strokeWidth={1.8} aria-hidden />
                    Shorten
                  </button>
                  <button type="button" onClick={() => run("Change tone")} className={control}>
                    <Smile width={14} height={14} strokeWidth={1.8} aria-hidden />
                    Tone
                  </button>
                  <button type="button" onClick={() => run("Fix grammar")} className={control}>
                    <Type width={14} height={14} strokeWidth={1.8} aria-hidden />
                    Grammar
                  </button>
                </div>

                <span className="mx-0.5 h-4 w-px shrink-0 bg-line" />
                <button
                  type="button"
                  aria-label={expanded ? "Show fewer actions" : "Show more actions"}
                  aria-expanded={expanded}
                  onClick={() => setExpanded((v) => !v)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-ink transition-[background-color,transform] duration-200 hover:bg-hover active:scale-[0.96]"
                >
                  <span
                    className="flex transition-transform duration-400"
                    style={{
                      transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                      transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
                    }}
                  >
                    <ChevronRight width={14} height={14} strokeWidth={1.8} aria-hidden />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
