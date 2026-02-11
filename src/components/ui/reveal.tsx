"use client"

import { useEffect, useRef, type ElementType, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: ElementType
}

export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion — show immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.remove("opacity-0")
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        if (delay > 0) {
          el.style.animationDelay = `${delay}ms`
        }

        el.classList.add("animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500", "fill-mode-both")
        el.classList.remove("opacity-0")
        observer.disconnect()
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <Tag ref={ref} className={cn("opacity-0", className)}>
      {children}
    </Tag>
  )
}
