"use client"

import { useSyncExternalStore } from "react"

function subscribe(callback: () => void) {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    mql.addEventListener("change", callback)
    return () => mql.removeEventListener("change", callback)
}

function getSnapshot() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getServerSnapshot() {
    return false
}

/**
 * Hook that respects the user's `prefers-reduced-motion` OS preference.
 * Returns `true` when the user has requested reduced motion.
 * Falls back to `false` during SSR / static export.
 */
export function useReducedMotion(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
