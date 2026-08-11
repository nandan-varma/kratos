"use client"

import * as React from "react"

/**
 * Tracks whether the `.dark` class is present on the document root,
 * for consumers (like charts) that can't just read CSS variables.
 */
export function useDarkMode() {
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    const root = document.documentElement
    const update = () => setDark(root.classList.contains("dark"))
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return dark
}
