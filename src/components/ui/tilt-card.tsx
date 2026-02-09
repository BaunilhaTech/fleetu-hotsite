"use client"

import React, { useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface TiltCardProps {
    children: React.ReactNode
    className?: string
    perspective?: number
}

export function TiltCard({ children, className, perspective = 1000 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 500, damping: 40 })
    const mouseY = useSpring(y, { stiffness: 500, damping: 40 })

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"])
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"])

    // Glare effects
    const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
    const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])
    const glareOpacity = useTransform(
        useMotionValue(0), // Placeholder logic - usually based on distance from center
        [0, 1],
        [0, 1]
    )

    // Simple radial gradient following mouse
    const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15) 0%, transparent 80%)`


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
            <div style={{ transform: "translateZ(20px)" }} className="h-full">
                {children}
            </div>

            {/* Glare Layer */}
            <motion.div
                className="absolute inset-0 pointer-events-none rounded-xl mix-blend-overlay z-50"
                style={{
                    background: glareBackground,
                    opacity: useTransform(mouseX, [-0.5, 0.5], [0, 0.6]) // Hacky opacity for now, simple is better
                }}
            />
        </motion.div>
    )
}
