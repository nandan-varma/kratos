"use client"

import * as React from "react"

import { SegmentedControl } from "@/registry/ui/segmented-control"
import { Shimmer } from "@/registry/ui/shimmer"

/**
 * CHAT — interactive panel with tabs, replies, and composer. The reply
 * sequence begins only after the user sends.
 */

type Phase = "idle" | "sent" | "typing" | "reply1" | "reply2" | "done"

const TAB_DATA = {
  Flavors: {
    submitted: "Compare mint chip to last summer",
    repl1: {
      label: "Sales History",
      sub: "Flavor Data",
      time: "4s",
      body: "Pulled 3 summers of mint chip sales for comparison. Sales are up 12% YoY with strongest weekends in July.",
    },
    repl2: {
      label: "Seasonal Trend",
      sub: "Forecast",
      time: "3s",
      body: 'Mint chip peaks in late spring. Consider a "Mint Chip Summer" promo tied to the June heatwave forecast.',
    },
  },
  Suppliers: {
    submitted: "Who supplies our mint?",
    repl1: {
      label: "Vendor Lookup",
      sub: "Supply Chain",
      time: "3s",
      body: "Mint extract comes from Alpine Flavors Inc (contract #AF-2024-112). Current lead time is 14 days.",
    },
    repl2: {
      label: "Price Alert",
      sub: "Procurement",
      time: "2s",
      body: "Alpine Flavors flagged a 7% price increase starting next quarter. Lock in current rates before Nov 1.",
    },
  },
} as const

type TabKey = keyof typeof TAB_DATA

function Section({
  label,
  sub,
  time,
  body,
  resolving,
}: {
  label: string
  sub: string
  time: string
  body: string
  resolving?: boolean
}) {
  return (
    <div
      className="flex w-full flex-col gap-1.5 transition-[opacity,filter,transform] duration-400"
      style={{
        opacity: resolving ? 0.55 : 1,
        filter: resolving ? "blur(0.5px)" : "blur(0)",
        transform: resolving ? "scale(0.985)" : "scale(1)",
        transformOrigin: "top left",
        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        animation: "fade-up 400ms cubic-bezier(0.23,1,0.32,1) both",
      }}
    >
      <div className="flex items-center gap-1 text-[12px] leading-[1.3]">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-ink-2">{sub}</span>
        <span className="text-ink">for {time}</span>
      </div>
      <p className="text-[13px] leading-normal text-ink">{body}</p>
    </div>
  )
}

export function ChatComposer() {
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [draft, setDraft] = React.useState("")
  const [tab, setTab] = React.useState<TabKey>("Flavors")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const data = TAB_DATA[tab]

  // auto-trigger on mount for docs demo
  React.useEffect(() => {
    const t = setTimeout(() => setPhase("sent"), 300)
    return () => clearTimeout(t)
  }, [])

  React.useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (phase === "sent") t = setTimeout(() => setPhase("typing"), 400)
    else if (phase === "typing") t = setTimeout(() => setPhase("reply1"), 800)
    else if (phase === "reply1") t = setTimeout(() => setPhase("reply2"), 1600)
    else if (phase === "reply2") t = setTimeout(() => setPhase("done"), 1200)
    else return
    return () => clearTimeout(t)
  }, [phase])

  const sent = phase !== "idle"
  const canSend = draft.trim().length > 0

  const send = () => {
    if (!canSend) return
    setDraft("")
    setPhase("sent")
  }

  const reset = () => {
    setPhase("idle")
  }

  const switchTab = (v: TabKey) => {
    setTab(v)
    setPhase("sent")
  }

  return (
    <div className="flex h-[312px] w-full max-w-95 flex-col self-start overflow-hidden rounded-card bg-surface shadow-card">
      {/* header bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-line p-1.5">
        <div className="w-40">
          <SegmentedControl
            segments={[
              { value: "Flavors", label: "Flavors" },
              { value: "Suppliers", label: "Suppliers" },
            ]}
            value={tab}
            onChangeAction={switchTab}
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="New chat"
            onClick={reset}
            className="flex size-6 items-center justify-center rounded-[6px] text-ink-3 transition-colors duration-100 hover:bg-hover hover:text-ink-2"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      {/* message area */}
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-3 pt-2.5 pb-1">
        {/* user message */}
        <div className="flex justify-end pl-14">
          <div
            className="rounded-xl bg-field px-3 py-1.5 text-[13px] leading-[1.4] text-ink transition-[opacity,transform] duration-300"
            style={{
              opacity: sent ? 1 : 0,
              transform: sent ? "translateY(0)" : "translateY(10px)",
              transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            {data.submitted}
          </div>
        </div>

        {/* typing indicator */}
        {(phase === "typing" || phase === "reply1" || phase === "reply2" || phase === "done") && (
          <div
            className="flex items-center gap-2 px-1"
            style={{
              animation: "fade-in 300ms ease-out both",
              opacity: phase === "typing" ? 1 : 0,
              transition: "opacity 300ms ease-out",
            }}
          >
            {phase === "typing" ? (
              <>
                <span className="flex size-5 items-center justify-center rounded-full bg-inset">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ink-3)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </span>
                <Shimmer className="text-[12px]">Researching</Shimmer>
              </>
            ) : (
              <span className="flex size-5 items-center justify-center rounded-full bg-accent-tint">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--accent)">
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                </svg>
              </span>
            )}
          </div>
        )}

        {/* reply sections */}
        {(phase === "reply1" || phase === "reply2" || phase === "done") && (
          <Section label={data.repl1.label} sub={data.repl1.sub} time={data.repl1.time} body={data.repl1.body} />
        )}
        {(phase === "reply2" || phase === "done") && (
          <Section
            label={data.repl2.label}
            sub={data.repl2.sub}
            time={data.repl2.time}
            body={data.repl2.body}
            resolving={phase === "reply2"}
          />
        )}

        {/* done indicator */}
        {phase === "done" && (
          <div className="flex items-center gap-1.5 px-1" style={{ animation: "fade-in 300ms ease-out both" }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--green)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="text-[11.5px] text-green font-medium">Complete</span>
          </div>
        )}
      </div>

      {/* composer */}
      <div className="mt-auto shrink-0 p-1.5">
        <div
          role="button"
          tabIndex={-1}
          onClick={() => inputRef.current?.focus()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.focus()
          }}
          className="flex cursor-text flex-col gap-2 rounded-control border border-line bg-field p-2.5 shadow-hairline transition-[border-color,box-shadow] duration-150 focus-within:border-line-strong focus-within:shadow-btn"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                send()
              }
            }}
            placeholder="Type a message…"
            aria-label="Chat prompt"
            className="min-h-4.5 bg-transparent text-[13px] leading-[1.4] text-ink outline-none placeholder:text-ink-3"
          />
          <div className="flex items-center justify-end">
            <button
              type="button"
              aria-label="Send"
              disabled={!canSend}
              onClick={send}
              className="flex size-7 items-center justify-center rounded-control transition-[background-color,color,transform] duration-200 enabled:active:scale-[0.96]"
              style={{
                background: canSend ? "var(--ink)" : "var(--line-strong)",
                color: canSend ? "var(--surface)" : "var(--ink-2)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
