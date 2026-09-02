"use client"

import {
  DrawablyArrow,
  DrawablyBadge,
  DrawablyButton,
  DrawablyCard,
  DrawablyCheckbox,
  DrawablyCircle,
  DrawablyDivider,
  DrawablyHighlight,
  DrawablyInput,
  DrawablyList,
  DrawablyRadio,
  DrawablySelect,
  DrawablyTextarea,
  DrawablyToggle,
  DrawablyUnderline,
} from "drawably/react"
import { useRef } from "react"

type ArtemisComponentPreviewProps = {
  name: string
  compact?: boolean
}

const controlProps = { stroke: "#818cf8", fill: "#818cf8" }

/**
 * A single runtime renderer for the Artemis registry. Registry item names are
 * passed in from registry.json, so the dashboard never carries a second list
 * of components or descriptions.
 */
export function ArtemisComponentPreview({ name, compact = false }: ArtemisComponentPreviewProps) {
  const from = useRef<HTMLSpanElement>(null)
  const to = useRef<HTMLSpanElement>(null)
  const label = compact ? "Example" : "Preview"

  switch (name) {
    case "button":
      return (
        <DrawablyButton variant="solid" stroke="#ffffff" fill="#ffffff" paper="#18181b">
          {label}
        </DrawablyButton>
      )
    case "checkbox":
      return <DrawablyCheckbox aria-label="Example checkbox" defaultChecked {...controlProps} />
    case "radio":
      return <DrawablyRadio aria-label="Example radio" name="artemis-preview-radio" defaultChecked {...controlProps} />
    case "toggle":
      return <DrawablyToggle aria-label="Example toggle" defaultChecked {...controlProps} />
    case "input":
      return (
        <DrawablyInput
          aria-label="Example input"
          className="artemis-field-surface w-full"
          placeholder="Your name"
          stroke="#818cf8"
        />
      )
    case "textarea":
      return (
        <DrawablyTextarea
          aria-label="Example textarea"
          className="artemis-field-surface w-full"
          rows={compact ? 2 : 4}
          placeholder="Write a note…"
          stroke="#818cf8"
        />
      )
    case "select":
      return (
        <DrawablySelect
          aria-label="Example select"
          className="artemis-field-surface"
          defaultValue="Pencil"
          paper="#eef2ff"
          stroke="#818cf8"
        >
          <option>Pen</option>
          <option>Pencil</option>
          <option>Brush</option>
        </DrawablySelect>
      )
    case "divider":
      return (
        <div className="w-full">
          <DrawablyDivider stroke="#a5b4fc" />
        </div>
      )
    case "card":
      return (
        <DrawablyCard className="w-full p-4 text-sm" stroke="#a5b4fc">
          A sketched container
        </DrawablyCard>
      )
    case "badge":
      return (
        <DrawablyBadge variant="scribble" stroke="#c4b5fd" fill="#c4b5fd">
          new
        </DrawablyBadge>
      )
    case "list":
      return (
        <DrawablyList marker="check" className="space-y-1 pl-6 text-sm" stroke="#6ee7b7" fill="#6ee7b7">
          <li>Semantic HTML</li>
          <li>Sketch markers</li>
        </DrawablyList>
      )
    case "underline":
      return <DrawablyUnderline stroke="#6ee7b7">hand-drawn</DrawablyUnderline>
    case "highlight":
      return (
        <DrawablyHighlight stroke="#fbbf24" fill="#fbbf24">
          a fresh sketch
        </DrawablyHighlight>
      )
    case "circle":
      return <DrawablyCircle stroke="#f472b6">attention</DrawablyCircle>
    case "arrow":
      return (
        <div className="relative flex w-full items-center justify-between px-2">
          <span ref={from} className="rounded-md bg-zinc-600 px-2 py-1 text-xs font-semibold text-white">
            from
          </span>
          <span ref={to} className="rounded-md bg-zinc-600 px-2 py-1 text-xs font-semibold text-white">
            to
          </span>
          <DrawablyArrow from={from} to={to} stroke="#c084fc" />
        </div>
      )
    default:
      return null
  }
}
