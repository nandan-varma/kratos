"use client"

import * as React from "react"

/**
 * CODE BLOCK
 * Code streams in line by line; copy reflects the streamed state.
 */

type Tok = { t: string; c?: "kw" | "str" | "fn" | "dim" }

const LINES: Tok[][] = [
  [{ t: "export function ", c: "kw" }, { t: "createSession", c: "fn" }, { t: "(", c: "dim" }, { t: "userId", c: "str" }, { t: ") {", c: "dim" }],
  [{ t: "  const ", c: "kw" }, { t: "token = " }, { t: "sign", c: "fn" }, { t: "({ userId }, ", c: "dim" }, { t: "SECRET", c: "str" }, { t: ");", c: "dim" }],
  [{ t: "  const ", c: "kw" }, { t: "expires = " }, { t: "Date." }, { t: "now", c: "fn" }, { t: "() + " }, { t: "SESSION_TTL", c: "str" }, { t: ";", c: "dim" }],
  [{ t: "  return ", c: "kw" }, { t: "{ token, expires };" }],
  [{ t: "}", c: "dim" }],
]

const COLORS: Record<string, string> = {
  kw: "var(--accent-ink)",
  str: "var(--green)",
  fn: "var(--ink)",
  dim: "var(--ink-3)",
}

const RAW = `export function createSession(userId) {
  const token = sign({ userId }, SECRET);
  const expires = Date.now() + SESSION_TTL;
  return { token, expires };
}`

const LINE_MS = 240
const HOLD_MS = 3200

export function CodeBlock() {
  const [count, setCount] = React.useState(0)
  const [copied, setCopied] = React.useState(false)
  const done = count >= LINES.length

  React.useEffect(() => {
    const t = setTimeout(
      () => setCount((c) => (c >= LINES.length ? 0 : c + 1)),
      count === 0 ? 400 : done ? HOLD_MS : LINE_MS,
    )
    return () => clearTimeout(t)
  }, [count, done])

  const copy = React.useCallback(() => {
    navigator.clipboard.writeText(RAW).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [])

  return (
    <div className="w-full max-w-95 overflow-hidden rounded-card bg-surface shadow-card">
      <div className="primitive-card-bar flex items-center justify-between border-b border-line">
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[12px] font-medium text-ink">session.ts</span>
          <span className="text-[11.5px] text-ink-3">TypeScript</span>
        </span>
        <button
          type="button"
          aria-label="Copy code"
          onClick={copy}
          className={`flex h-6 items-center gap-1 rounded-[6px] px-1.5 text-[11.5px] font-medium transition-colors duration-100 hover:bg-hover ${
            copied ? "text-green" : "text-ink-3 hover:text-ink"
          }`}
        >
          {copied ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="12" height="12" rx="2.5" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="min-h-[137px] bg-inset px-3 py-2.5 font-mono text-[11.5px] leading-[1.7]">
        {LINES.slice(0, count).map((line, i) => (
          <div key={i} className="flex" style={{ animation: "fade-up 250ms cubic-bezier(0.23,1,0.32,1) both" }}>
            <span className="w-5 shrink-0 text-right text-[10.5px] leading-[1.86] text-ink-3/60 select-none">{i + 1}</span>
            <span className="pl-2.5 whitespace-pre">
              {line.map((tok, j) => (
                <span key={j} style={{ color: tok.c ? COLORS[tok.c] : "var(--ink-2)" }}>
                  {tok.t}
                </span>
              ))}
              {i === count - 1 && !done && (
                <span className="ml-0.5 inline-block h-3 w-[3px] translate-y-0.5 rounded-full bg-accent" />
              )}
            </span>
          </div>
        ))}
      </pre>
    </div>
  )
}
