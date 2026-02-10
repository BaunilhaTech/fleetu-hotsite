"use client"

import { useEffect, useState } from "react"

/**
 * Hook that respects the user's `prefers-reduced-motion` OS preference.
 * Returns `true` when the user has requested reduced motion.
 * Falls back to `false` during SSR / static export.
 */
export function useReducedMotion(): boolean {
    const [prefersReduced, setPrefersReduced] = useState(false)

    useEffect(() => {
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
        setPrefersReduced(mql.matches)

        const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
        mql.addEventListener("change", handler)
        return () => mql.removeEventListener("change", handler)
    }, [])

    return prefersReduced
}
