"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Terminal } from "lucide-react"
import { useTranslations } from "next-intl"

// Card data with translation keys and code (code stays in English as it's YAML)
const CARDS_DATA = [
    {
        intentKey: "card1",
        code: `shift: python-http-timeout-v1
scope:
  language: python
  framework: fastapi
transform:
  operator: add-timeout@1.2.0
validate:
  tests: pytest
rollout:
  strategy: canary
  waves: [10, 50, 100]`,
    },
    {
        intentKey: "card2",
        code: `shift: java-version-migration
scope:
  language: java
  version: "< 17"
transform:
  operator: java-upgrade@2.0.0
  config:
    target: 17
    fix_deprecations: true
rollout:
  strategy: progressive
  waves: [5, 25, 100]`,
    },
    {
        intentKey: "card3",
        code: `shift: cve-2024-patch
scope:
  dependency: log4j
  version: "< 2.17.1"
transform:
  operator: dependency-update@1.0.0
validate:
  security_scan: true
rollout:
  strategy: immediate
  priority: critical`,
    },
    {
        intentKey: "card4",
        code: `shift: ci-standard-v2
scope:
  has_file: ".github/workflows/*"
transform:
  operator: ci-template@2.0.0
  config:
    template: standard-pipeline
validate:
  ci_check: true
rollout:
  waves: [10, 50, 100]`,
    },
    {
        intentKey: "card5",
        code: `capability: auth-module-v2
scope:
  tag: microservice
  has_api: true
transform:
  operator: add-auth@2.0.0
  config:
    provider: oauth2
    mfa: optional
validate:
  tests: integration
rollout:
  strategy: canary`,
    },
]

// Triplicate cards for seamless infinite loop
const LOOPED_CARDS = [...CARDS_DATA, ...CARDS_DATA, ...CARDS_DATA]

// Particle type
interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    alpha: number
    life: number
    decay: number
}

export function IntentScanner() {
    const t = useTranslations("Hero")
    const tScanner = useTranslations("IntentScanner")
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animationRef = useRef<number>(0)

    const [position, setPosition] = useState<number | null>(null)
    const [containerWidth, setContainerWidth] = useState(0)

    const CARD_WIDTH = 380
    const CARD_GAP = 48
    const SINGLE_SET_WIDTH = (CARD_WIDTH + CARD_GAP) * CARDS_DATA.length

    // Initialize canvas and particle animation
    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect()
            canvas.width = rect.width
            canvas.height = 300
            setContainerWidth(rect.width)
        }
        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Particle gradient
        const gradCanvas = document.createElement("canvas")
        const gradCtx = gradCanvas.getContext("2d")!
        gradCanvas.width = 32
        gradCanvas.height = 32
        const half = 16
        const gradient = gradCtx.createRadialGradient(half, half, 0, half, half, half)
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
        gradient.addColorStop(0.2, "rgba(196, 181, 253, 0.9)")
        gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.5)")
        gradient.addColorStop(1, "transparent")
        gradCtx.fillStyle = gradient
        gradCtx.beginPath()
        gradCtx.arc(half, half, half, 0, Math.PI * 2)
        gradCtx.fill()

        const createParticle = (x: number): Particle => ({
            x: x + (Math.random() - 0.5) * 8,
            y: Math.random() * 300,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            alpha: Math.random() * 0.6 + 0.4,
            life: 1,
            decay: Math.random() * 0.01 + 0.003,
        })

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const centerX = canvas.width / 2

            ctx.globalCompositeOperation = "lighter"

            // Wide ambient glow
            const glow4 = ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0)
            glow4.addColorStop(0, "rgba(139, 92, 246, 0)")
            glow4.addColorStop(0.5, "rgba(139, 92, 246, 0.08)")
            glow4.addColorStop(1, "rgba(139, 92, 246, 0)")
            ctx.globalAlpha = 0.6
            ctx.fillStyle = glow4
            ctx.fillRect(centerX - 100, 0, 200, 300)

            // Outer glow 3
            const glow3 = ctx.createLinearGradient(centerX - 50, 0, centerX + 50, 0)
            glow3.addColorStop(0, "rgba(139, 92, 246, 0)")
            glow3.addColorStop(0.5, "rgba(139, 92, 246, 0.2)")
            glow3.addColorStop(1, "rgba(139, 92, 246, 0)")
            ctx.globalAlpha = 0.7
            ctx.fillStyle = glow3
            ctx.beginPath()
            ctx.roundRect(centerX - 50, 0, 100, 300, 30)
            ctx.fill()

            // Outer glow 2
            const glow2 = ctx.createLinearGradient(centerX - 20, 0, centerX + 20, 0)
            glow2.addColorStop(0, "rgba(139, 92, 246, 0)")
            glow2.addColorStop(0.5, "rgba(139, 92, 246, 0.5)")
            glow2.addColorStop(1, "rgba(139, 92, 246, 0)")
            ctx.globalAlpha = 0.8
            ctx.fillStyle = glow2
            ctx.beginPath()
            ctx.roundRect(centerX - 20, 0, 40, 300, 25)
            ctx.fill()

            // Glow layer 1
            const glow1 = ctx.createLinearGradient(centerX - 10, 0, centerX + 10, 0)
            glow1.addColorStop(0, "rgba(139, 92, 246, 0)")
            glow1.addColorStop(0.5, "rgba(196, 181, 253, 0.9)")
            glow1.addColorStop(1, "rgba(139, 92, 246, 0)")
            ctx.globalAlpha = 0.9
            ctx.fillStyle = glow1
            ctx.beginPath()
            ctx.roundRect(centerX - 10, 0, 20, 300, 20)
            ctx.fill()

            // Core scanner line
            const coreGradient = ctx.createLinearGradient(centerX - 2, 0, centerX + 2, 0)
            coreGradient.addColorStop(0, "rgba(255, 255, 255, 0)")
            coreGradient.addColorStop(0.5, "rgba(255, 255, 255, 1)")
            coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
            ctx.globalAlpha = 1
            ctx.fillStyle = coreGradient
            ctx.beginPath()
            ctx.roundRect(centerX - 2, 0, 4, 300, 15)
            ctx.fill()

            // Vertical fade
            const fadeMask = ctx.createLinearGradient(0, 0, 0, 300)
            fadeMask.addColorStop(0, "rgba(255, 255, 255, 0)")
            fadeMask.addColorStop(0.1, "rgba(255, 255, 255, 1)")
            fadeMask.addColorStop(0.9, "rgba(255, 255, 255, 1)")
            fadeMask.addColorStop(1, "rgba(255, 255, 255, 0)")
            ctx.globalCompositeOperation = "destination-in"
            ctx.globalAlpha = 1
            ctx.fillStyle = fadeMask
            ctx.fillRect(0, 0, canvas.width, 300)

            // Add new particles from scanner
            if (Math.random() < 0.95 && particlesRef.current.length < 600) {
                particlesRef.current.push(createParticle(centerX))
                particlesRef.current.push(createParticle(centerX))
            }

            ctx.globalCompositeOperation = "lighter"
            particlesRef.current = particlesRef.current.filter((p) => {
                p.x += p.vx
                p.y += p.vy
                p.life -= p.decay

                if (p.life <= 0 || p.x < -20 || p.x > canvas.width + 20) return false

                let fadeAlpha = 1
                if (p.y < 30) fadeAlpha = p.y / 30
                else if (p.y > 270) fadeAlpha = (300 - p.y) / 30

                ctx.globalAlpha = p.alpha * p.life * Math.max(0, fadeAlpha)
                ctx.drawImage(gradCanvas, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2)
                return true
            })

            ctx.globalAlpha = 1
            ctx.globalCompositeOperation = "source-over"

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            cancelAnimationFrame(animationRef.current)
        }
    }, [])

    // Card stream animation - left to right, start populated
    useEffect(() => {
        if (containerWidth === 0) return

        const startPos = -SINGLE_SET_WIDTH
        let pos = startPos
        setPosition(pos)

        let frameId: number

        const animateCards = () => {
            pos += 0.5
            if (pos > 0) {
                pos = -SINGLE_SET_WIDTH
            }
            setPosition(pos)
            frameId = requestAnimationFrame(animateCards)
        }

        animateCards()

        return () => cancelAnimationFrame(frameId)
    }, [containerWidth, SINGLE_SET_WIDTH])

    // Calculate clip percentage for a card
    // Cards move left-to-right: RIGHT edge touches scanner first
    // Clip Intent from RIGHT to reveal Shift from RIGHT
    const getClipPercent = (index: number): number => {
        if (position === null) return 0
        const scannerX = containerWidth / 2
        const cardStart = position + index * (CARD_WIDTH + CARD_GAP)
        const cardEnd = cardStart + CARD_WIDTH

        // Card is fully LEFT of scanner (right edge hasn't reached) = show Intent (0%)
        if (cardEnd <= scannerX) return 0
        // Card is fully RIGHT of scanner (left edge has passed) = show Shift (100%)
        if (cardStart >= scannerX) return 100
        // Card is crossing - clip from RIGHT as right edge passes scanner
        return ((cardEnd - scannerX) / CARD_WIDTH) * 100
    }

    return (
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16 min-h-[90vh]">
            <div className="container relative z-10 px-4 md:px-6 mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                        <Terminal className="mr-2 h-4 w-4" />
                        <span>Governance as Code</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                        {t("title")}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-[700px] text-muted-foreground md:text-xl/relaxed"
                    >
                        {t("description")}
                    </motion.p>
                </div>

                {/* Scanner Visualization */}
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative w-full h-[300px] overflow-hidden"
                >
                    {/* Scanner canvas with particles */}
                    <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

                    {/* Card stream */}
                    <div
                        className="absolute top-0 left-0 flex items-center gap-12 h-full z-5"
                        style={{ transform: `translateX(${position}px)`, willChange: "transform" }}
                    >
                        {LOOPED_CARDS.map((card, index) => {
                            const clipPercent = getClipPercent(index)
                            return (
                                <div key={index} className="relative w-[380px] h-[250px] flex-shrink-0">
                                    {/* Shift Card (base layer - revealed after passing scanner) */}
                                    <div className="absolute inset-0 rounded-xl border border-violet-500/30 bg-zinc-950/95 backdrop-blur-sm p-5 overflow-hidden">
                                        <div className="text-xs font-mono text-violet-400/80 uppercase tracking-wider mb-2">
                                            {tScanner("shift")}
                                        </div>
                                        <pre className="text-[10px] font-mono text-violet-300/80 leading-tight overflow-hidden">
                                            {card.code}
                                        </pre>
                                    </div>

                                    {/* Intent Card (top layer - clips away to reveal Shift) */}
                                    <div
                                        className="absolute inset-0 rounded-xl border border-blue-500/20 bg-zinc-900/95 backdrop-blur-sm p-5 overflow-hidden"
                                        style={{ clipPath: `inset(0 ${clipPercent}% 0 0)` }}
                                    >
                                        <div className="text-xs font-mono text-blue-400/80 uppercase tracking-wider mb-3">
                                            {tScanner("intent")}
                                        </div>
                                        <p className="text-lg font-medium text-foreground leading-relaxed">
                                            "{tScanner(card.intentKey)}"
                                        </p>
                                        <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2 text-xs text-muted-foreground/50">
                                            <span className="w-2 h-2 rounded-full bg-blue-500/50 animate-pulse" />
                                            {tScanner("naturalLanguage")}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col items-center gap-4 mt-12 sm:flex-row sm:justify-center"
                >
                    <Button size="lg" className="h-12 px-8 text-base">
                        {t("cta")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                        {t("demo")}
                    </Button>
                </motion.div>

                <div className="mt-8 text-center text-xs text-muted-foreground/40 font-mono">
                    Inspired by{" "}
                    <a
                        href="https://evervault.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                    >
                        evervault.com
                    </a>
                </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-500/10 blur-[120px] rounded-full -z-10" />
        </section>
    )
}
