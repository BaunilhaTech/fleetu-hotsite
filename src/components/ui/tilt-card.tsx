"use client"

import React, { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface TiltCardProps {
    children: React.ReactNode
    className?: string
    perspective?: number
}

export function TiltCard({ children, className, perspective = 1400 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.8 })
    const mouseY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.8 })

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"])
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"])

    // Glare effects
    const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
    const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])

    const glareOpacity = useTransform(mouseX, [-0.5, 0, 0.5], [0.1, 0.2, 0.1])
    // Wide glare so it reaches card borders without clipped-looking margins
    const glareBackground = useMotionTemplate`radial-gradient(140% 140% at ${glareX} ${glareY}, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.03) 55%, transparent 100%)`


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseXFromCenter = e.clientX - rect.left - width / 2
        const mouseYFromCenter = e.clientY - rect.top - height / 2

        x.set(mouseXFromCenter / width)
        y.set(mouseYFromCenter / height)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective,
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={cn("relative will-change-transform group", className)}
        >
            <div style={{ transform: "translateZ(12px)" }} className="h-full">
                {children}
            </div>

            {/* Glare Layer */}
            <motion.div
                className="absolute -inset-px pointer-events-none rounded-[14px] mix-blend-overlay z-50"
                style={{
                    background: glareBackground,
                    opacity: glareOpacity
                }}
            />
        </motion.div>
    )
}
