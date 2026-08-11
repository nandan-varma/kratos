"use client"

import * as React from "react"

/**
 * PROMPT BAR
 * A composer with @ sources, / commands, a model picker, and dictation.
 * Type @ or / to open the menus; up/down + Enter to pick.
 */

function Icon({
  children,
  size = 15,
  strokeWidth = 1.8,
}: {
  children: React.ReactNode
  size?: number
  strokeWidth?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const GLYPHS: Record<string, React.ReactNode> = {
  clip: (
    <path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  layers: (
    <g>
      <path d="M12 2 2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </g>
  ),
  globe: (
    <g>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </g>
  ),
}

type Source = { key: string; name: string; desc: string; glyph: string; attach?: boolean }

const SOURCES: Source[] = [
  { key: "attach", name: "Add files", desc: "Upload from your computer", glyph: "clip", attach: true },
  { key: "metrics", name: "Metrics", desc: "Usage & billing data", glyph: "chart" },
  { key: "records", name: "Records", desc: "42 tables, schemas, links", glyph: "layers" },
  { key: "web", name: "Web search", desc: "Real-time news and info", glyph: "globe" },
]

const COMMANDS = [
  { key: "summarize", name: "/summarize", desc: "Digest the thread so far" },
  { key: "plan", name: "/plan", desc: "Draft an implementation plan" },
  { key: "review", name: "/review", desc: "Review the current diff" },
  { key: "draft-email", name: "/draft-email", desc: "Write a status update" },
]

const MODELS = [
  { key: "orion-large", name: "Orion Large", tag: "Flagship" },
  { key: "orion-fast", name: "Orion Fast", tag: "Basic" },
]

const FILES = ["dashboard.png", "release-notes.md", "usage-export.csv"]

function parseToken(draft: string): { kind: "at" | "slash"; query: string; start: number } | null {
  const match = /(^|\s)([@/])([\w-]*)$/.exec(draft)
  if (!match) return null
  return {
    kind: match[2] === "@" ? "at" : "slash",
    query: match[3].toLowerCase(),
    start: match.index + match[1].length,
  }
}

export function PromptBar({ variant = "Rounded" }: { variant?: string }) {
  const pill = variant === "Pill"
  const [draft, setDraft] = React.useState("")
  const [dismissed, setDismissed] = React.useState(false)
  const [modelOpen, setModelOpen] = React.useState(false)
  const [model, setModel] = React.useState(MODELS[0])
  const [attachments, setAttachments] = React.useState<string[]>([])
  const [active, setActive] = React.useState(0)
  const [listening, setListening] = React.useState(false)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const token = dismissed ? null : parseToken(draft)
  const menu: "at" | "slash" | null = token?.kind ?? null
  const query = token?.query ?? ""

  const rows: { key: string; name: string; desc: string }[] =
    menu === "at"
      ? SOURCES.filter((s) => s.name.toLowerCase().includes(query))
      : menu === "slash"
        ? COMMANDS.filter((c) => c.name.slice(1).startsWith(query))
        : []

  const [activeResetKey, setActiveResetKey] = React.useState(`${menu}:${query}`)
  if (activeResetKey !== `${menu}:${query}`) {
    setActiveResetKey(`${menu}:${query}`)
    setActive(0)
  }

  React.useEffect(() => {
    if (!listening) return
    const t = setTimeout(() => {
      setDraft((current) =>
        current ? `${current.trimEnd()} Summarize this week's deploys` : "Summarize this week's deploys",
      )
      setListening(false)
      inputRef.current?.focus()
    }, 2000)
    return () => clearTimeout(t)
  }, [listening])

  const pick = (row: { key: string; name: string }) => {
    const source = SOURCES.find((s) => s.key === row.key)
    if (source?.attach) {
      setAttachments((current) => [...current, FILES[current.length % FILES.length]])
      if (token) setDraft(draft.slice(0, token.start))
    } else if (menu === "at") {
      setDraft(`${token ? draft.slice(0, token.start) : draft}@${row.name} `)
    } else {
      setDraft(`${token ? draft.slice(0, token.start) : draft}${row.name} `)
    }
    setDismissed(false)
    inputRef.current?.focus()
  }

  const canSend = draft.trim().length > 0 || attachments.length > 0
  const send = () => {
    if (!canSend) return
    setDraft("")
    setAttachments([])
  }

  return (
    <div className="flex w-full max-w-105 flex-col justify-end pb-2">
      <div className="relative">
        {menu && (
          <div
            className="absolute inset-x-0 bottom-full z-10 mb-2 rounded-[10px] bg-surface p-1 shadow-raised"
            style={{ animation: "pop-in 180ms cubic-bezier(0.23,1,0.32,1) both", transformOrigin: "bottom center" }}
          >
            {rows.map((row, i) => {
              const source = menu === "at" ? SOURCES.find((s) => s.key === row.key) : undefined
              return (
                <button
                  key={row.key}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(row)}
                  className={`relative z-10 flex h-9 w-full items-center gap-2.5 rounded-[6px] px-2 text-left transition-colors duration-100 ${
                    active === i ? "bg-hover" : ""
                  }`}
                >
                  {source && (
                    <span className="flex size-5.5 shrink-0 items-center justify-center text-ink-2">
                      <Icon size={15}>{GLYPHS[source.glyph]}</Icon>
                    </span>
                  )}
                  <span className="shrink-0 text-[12.5px] font-medium text-ink">{row.name}</span>
                  <span className="min-w-0 flex-1 truncate text-[12px] text-ink-3">{row.desc}</span>
                </button>
              )
            })}
            {rows.length === 0 && (
              <div className="flex h-9 items-center px-2 text-[12px] text-ink-3">
                No matches for &quot;{query}&quot;
              </div>
            )}
            <div className="mt-1 border-t border-line px-2 pt-1.5 pb-1 text-[11px] text-ink-3">
              {menu === "at" ? "Type to search sources & files" : "Type to search commands"}
            </div>
          </div>
        )}

        {modelOpen && (
          <div
            className="absolute right-0 bottom-full z-10 mb-2 w-44 rounded-[10px] bg-surface p-1 shadow-raised"
            style={{ animation: "pop-in 180ms cubic-bezier(0.23,1,0.32,1) both", transformOrigin: "bottom right" }}
          >
            {MODELS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => {
                  setModel(m)
                  setModelOpen(false)
                  inputRef.current?.focus()
                }}
                className="flex h-7.5 w-full items-center gap-2 rounded-[6px] px-2 text-left transition-colors duration-100 hover:bg-hover"
              >
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">{m.name}</span>
                <span className="shrink-0 text-[11px] text-ink-3">{m.tag}</span>
                <span className={`shrink-0 text-ink ${m.key === model.key ? "" : "invisible"}`}>
                  <Icon size={13} strokeWidth={2.5}>
                    <path d="M20 6L9 17l-5-5" />
                  </Icon>
                </span>
              </button>
            ))}
          </div>
        )}

        <div
          className={`relative flex flex-col gap-1.5 overflow-hidden border border-line bg-surface p-1.5 shadow-card transition-[border-color,border-radius] duration-150 focus-within:border-line-strong ${
            pill ? "rounded-[24px]" : "rounded-[14px]"
          }`}
        >
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-0.5 pt-0.5">
              {attachments.map((file, i) => (
                <span
                  key={`${file}-${i}`}
                  className="flex h-6.5 items-center gap-1.5 rounded-chip bg-field py-1 pr-1 pl-1.5 text-[11.5px] text-ink-2 shadow-hairline"
                  style={{ animation: "pop-in 200ms cubic-bezier(0.23,1,0.32,1) both" }}
                >
                  <Icon size={12}>
                    <g>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                    </g>
                  </Icon>
                  <span className="max-w-36 truncate">{file}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${file}`}
                    onClick={() => setAttachments((current) => current.filter((_, j) => j !== i))}
                    className="flex size-4 items-center justify-center rounded-[4px] text-ink-3 transition-colors duration-100 hover:bg-line/70 hover:text-ink"
                  >
                    <Icon size={10} strokeWidth={2.5}>
                      <path d="M18 6L6 18M6 6l12 12" />
                    </Icon>
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-end gap-1">
            <button
              type="button"
              aria-label="Add attachments and sources"
              onClick={() => {
                setDraft((d) => (d.endsWith("@") ? d : `${d}@`))
                inputRef.current?.focus()
              }}
              className="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-ink-3 transition-[background-color,color,transform] duration-150 hover:bg-hover hover:text-ink active:scale-[0.94]"
            >
              <Icon size={16} strokeWidth={2}>
                <path d="M12 5v14M5 12h14" />
              </Icon>
            </button>

            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value)
                setDismissed(false)
              }}
              onKeyDown={(event) => {
                if (menu && rows.length > 0) {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault()
                    setActive((current) => (current + (event.key === "ArrowDown" ? 1 : rows.length - 1)) % rows.length)
                    return
                  }
                  if ((event.key === "Enter" && !event.shiftKey) || event.key === "Tab") {
                    event.preventDefault()
                    pick(rows[active])
                    return
                  }
                }
                if (event.key === "Escape") {
                  setDismissed(true)
                  return
                }
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  send()
                }
              }}
              placeholder={listening ? "Listening…" : "Write a message…"}
              aria-label="Prompt"
              className="min-h-7 min-w-0 flex-1 resize-none bg-transparent px-1 py-[5px] text-[13px] leading-[18px] text-ink outline-none placeholder:text-ink-3"
            />

            <button
              type="button"
              aria-expanded={modelOpen}
              aria-label="Choose model"
              onClick={() => setModelOpen((current) => !current)}
              className="flex h-7 shrink-0 items-center gap-1 rounded-[8px] px-1.5 text-[12px] font-medium text-ink-2 transition-colors duration-150 hover:bg-hover hover:text-ink"
            >
              {model.name}
              <span className="text-ink-3">
                <Icon size={11} strokeWidth={2.4}>
                  <path d="M6 9l6 6 6-6" />
                </Icon>
              </span>
            </button>

            <button
              type="button"
              aria-label={listening ? "Stop dictation" : "Start dictation"}
              aria-pressed={listening}
              onClick={() => setListening((current) => !current)}
              className={`flex size-7 shrink-0 items-center justify-center rounded-[8px] transition-[background-color,color,transform] duration-150 active:scale-[0.94] ${
                listening ? "bg-accent-tint text-accent-ink" : "text-ink-3 hover:bg-hover hover:text-ink"
              }`}
            >
              {listening ? (
                <span className="flex h-3.5 items-center gap-[2.5px]">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-[2.5px] rounded-full bg-current"
                      style={{ height: "100%", animation: `eq-bounce 900ms ease-in-out ${i * 150}ms infinite` }}
                    />
                  ))}
                </span>
              ) : (
                <Icon size={15} strokeWidth={2}>
                  <g>
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
                  </g>
                </Icon>
              )}
            </button>

            <button
              type="button"
              aria-label="Send"
              disabled={!canSend}
              onClick={send}
              className="flex size-7 shrink-0 items-center justify-center rounded-[8px] transition-[background-color,color,transform] duration-200 enabled:active:scale-[0.94]"
              style={{
                background: canSend ? "var(--ink)" : "var(--line-strong)",
                color: canSend ? "var(--surface)" : "var(--ink-2)",
              }}
            >
              <Icon size={16} strokeWidth={2.4}>
                <path d="M12 19V5M5 12l7-7 7 7" />
              </Icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
