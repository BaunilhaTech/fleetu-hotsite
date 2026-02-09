"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Terminal } from "lucide-react"
import { useTranslations } from "next-intl"

// Card data with translation keys, category, and code
const CARDS_DATA = [
  {
    intentKey: "card1",
    categoryKey: "catSecurity",
    code: `shift: cve-2024-1234-patch
scope:
  dependency: log4j
  version: "< 2.17.1"
transform:
  operator: dep-update@1.0.0
validate:
  security_scan: true
rollout:
  strategy: immediate
  priority: critical`,
  },
  {
    intentKey: "card2",
    categoryKey: "catDependency",
    code: `shift: spring-boot-3-upgrade
scope:
  language: java
  framework: spring-boot
  version: "< 3.0"
transform:
  operator: spring-upgrade@3.0.0
  config:
    jakarta_migration: true
validate:
  tests: integration
rollout:
  strategy: progressive
  waves: [5, 25, 100]`,
  },
  {
    intentKey: "card3",
    categoryKey: "catSyntax",
    code: `shift: async-await-migration
scope:
  language: typescript
  ast_pattern: "CallExpression[callee.property.name='then']"
transform:
  operator: async-refactor@2.0.0
validate:
  tests: jest
rollout:
  strategy: canary
  waves: [10, 50, 100]`,
  },
  {
    intentKey: "card4",
    categoryKey: "catArchitecture",
    code: `shift: ci-standard-v2
scope:
  has_file: ".github/workflows/*"
transform:
  operator: ci-template@2.0.0
  config:
    template: org-standard
validate:
  ci_check: true
rollout:
  strategy: progressive
  waves: [10, 50, 100]`,
  },
  {
    intentKey: "card5",
    categoryKey: "catMigration",
    code: `shift: java-17-migration
scope:
  language: java
  version: "< 17"
transform:
  operator: java-upgrade@2.0.0
  config:
    target: 17
    fix_deprecations: true
validate:
  tests: unit
rollout:
  strategy: progressive
  waves: [5, 25, 100]`,
  },
  {
    intentKey: "card6",
    categoryKey: "catSharedFeature",
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
  strategy: canary
  waves: [10, 50, 100]`,
  },
  {
    intentKey: "card7",
    categoryKey: "catObservability",
    code: `shift: otel-instrumentation
scope:
  tag: backend
  runtime: [node, python, java]
transform:
  operator: add-otel@1.5.0
  config:
    traces: true
    metrics: true
    logs: structured
rollout:
  strategy: progressive
  waves: [10, 50, 100]`,
  },
  {
    intentKey: "card8",
    categoryKey: "catSecurity",
    code: `shift: secrets-rotation
scope:
  secret_type: [api_key, token, password]
  age: "> 90d"
transform:
  operator: rotate-secrets@1.0.0
  config:
    vault: hashicorp
validate:
  security_audit: true
rollout:
  strategy: immediate`,
  },
  {
    intentKey: "card9",
    categoryKey: "catArchitecture",
    code: `shift: error-handling-std
scope:
  language: typescript
  missing_pattern: "ErrorBoundary"
transform:
  operator: error-boundary@1.2.0
  config:
    logger: structured
    retry: exponential
validate:
  tests: unit
rollout:
  strategy: canary
  waves: [10, 50, 100]`,
  },
  {
    intentKey: "card10",
    categoryKey: "catDependency",
    code: `shift: react-19-upgrade
scope:
  framework: react
  version: "< 19"
transform:
  operator: react-upgrade@19.0.0
  config:
    concurrent: true
    suspense: true
validate:
  tests: [jest, cypress]
rollout:
  strategy: canary
  waves: [5, 25, 100]`,
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
  const [cardScale, setCardScale] = useState(1)
  const scannerHeightRef = useRef(300)

  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth
      let s: number
      if (w < 640) s = 0.7
      else if (w < 1024) s = 0.7 + ((w - 640) / (1024 - 640)) * 0.3
      else s = 1
      setCardScale(s)
      scannerHeightRef.current = Math.round(300 * s)
    }
    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [])

  const CARD_WIDTH = Math.round(380 * cardScale)
  const CARD_HEIGHT = Math.round(250 * cardScale)
  const CARD_GAP = Math.round(48 * cardScale)
  const SCANNER_HEIGHT = Math.round(300 * cardScale)
  const SINGLE_SET_WIDTH = (CARD_WIDTH + CARD_GAP) * CARDS_DATA.length

  const [position, setPosition] = useState<number | null>(-SINGLE_SET_WIDTH)
  const [containerWidth, setContainerWidth] = useState(0)

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
      canvas.height = scannerHeightRef.current
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
      y: Math.random() * scannerHeightRef.current,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.4,
      life: 1,
      decay: Math.random() * 0.01 + 0.003,
    })

    const animate = () => {
      const h = scannerHeightRef.current
      ctx.clearRect(0, 0, canvas.width, h)
      const centerX = canvas.width / 2

      ctx.globalCompositeOperation = "lighter"

      // Wide ambient glow
      const glow4 = ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0)
      glow4.addColorStop(0, "rgba(139, 92, 246, 0)")
      glow4.addColorStop(0.5, "rgba(139, 92, 246, 0.08)")
      glow4.addColorStop(1, "rgba(139, 92, 246, 0)")
      ctx.globalAlpha = 0.6
      ctx.fillStyle = glow4
      ctx.fillRect(centerX - 100, 0, 200, h)

      // Outer glow 3
      const glow3 = ctx.createLinearGradient(centerX - 50, 0, centerX + 50, 0)
      glow3.addColorStop(0, "rgba(139, 92, 246, 0)")
      glow3.addColorStop(0.5, "rgba(139, 92, 246, 0.2)")
      glow3.addColorStop(1, "rgba(139, 92, 246, 0)")
      ctx.globalAlpha = 0.7
      ctx.fillStyle = glow3
      ctx.beginPath()
      ctx.roundRect(centerX - 50, 0, 100, h, 30)
      ctx.fill()

      // Outer glow 2
      const glow2 = ctx.createLinearGradient(centerX - 20, 0, centerX + 20, 0)
      glow2.addColorStop(0, "rgba(139, 92, 246, 0)")
      glow2.addColorStop(0.5, "rgba(139, 92, 246, 0.5)")
      glow2.addColorStop(1, "rgba(139, 92, 246, 0)")
      ctx.globalAlpha = 0.8
      ctx.fillStyle = glow2
      ctx.beginPath()
      ctx.roundRect(centerX - 20, 0, 40, h, 25)
      ctx.fill()

      // Glow layer 1
      const glow1 = ctx.createLinearGradient(centerX - 10, 0, centerX + 10, 0)
      glow1.addColorStop(0, "rgba(139, 92, 246, 0)")
      glow1.addColorStop(0.5, "rgba(196, 181, 253, 0.9)")
      glow1.addColorStop(1, "rgba(139, 92, 246, 0)")
      ctx.globalAlpha = 0.9
      ctx.fillStyle = glow1
      ctx.beginPath()
      ctx.roundRect(centerX - 10, 0, 20, h, 20)
      ctx.fill()

      // Core scanner line
      const coreGradient = ctx.createLinearGradient(centerX - 2, 0, centerX + 2, 0)
      coreGradient.addColorStop(0, "rgba(255, 255, 255, 0)")
      coreGradient.addColorStop(0.5, "rgba(255, 255, 255, 1)")
      coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.globalAlpha = 1
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.roundRect(centerX - 2, 0, 4, h, 15)
      ctx.fill()

      // Vertical fade
      const fadeMask = ctx.createLinearGradient(0, 0, 0, h)
      fadeMask.addColorStop(0, "rgba(255, 255, 255, 0)")
      fadeMask.addColorStop(0.1, "rgba(255, 255, 255, 1)")
      fadeMask.addColorStop(0.9, "rgba(255, 255, 255, 1)")
      fadeMask.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.globalCompositeOperation = "destination-in"
      ctx.globalAlpha = 1
      ctx.fillStyle = fadeMask
      ctx.fillRect(0, 0, canvas.width, h)

      // Add new particles from scanner
      if (Math.random() < 0.95 && particlesRef.current.length < 600) {
        particlesRef.current.push(createParticle(centerX))
        particlesRef.current.push(createParticle(centerX))
      }

      ctx.globalCompositeOperation = "lighter"
      const fadeEdge = h * 0.1
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay

        if (p.life <= 0 || p.x < -20 || p.x > canvas.width + 20) return false

        let fadeAlpha = 1
        if (p.y < fadeEdge) fadeAlpha = p.y / fadeEdge
        else if (p.y > h - fadeEdge) fadeAlpha = (h - p.y) / fadeEdge

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
            <span>{t("badge")}</span>
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
          className="relative w-full overflow-hidden"
          style={{
            height: `${SCANNER_HEIGHT}px`,
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          {/* Scanner canvas with particles */}
          <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

          {/* Card stream */}
          <div
            className="absolute top-0 left-0 flex items-center h-full z-5"
            style={{ transform: `translateX(${position}px)`, willChange: "transform", gap: `${CARD_GAP}px` }}
          >
            {LOOPED_CARDS.map((card, index) => {
              const clipPercent = getClipPercent(index)
              return (
                <div key={index} className="relative flex-shrink-0" style={{ width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }}>
                  {/* Shift Card (base layer - revealed after passing scanner) */}
                  <div
                    className="absolute top-0 left-0 origin-top-left rounded-xl border border-violet-500/30 bg-zinc-950/95 backdrop-blur-sm p-5 overflow-hidden"
                    style={{ width: 380, height: 250, transform: `scale(${cardScale})` }}
                  >
                    <div className="text-xs font-mono text-violet-400/80 uppercase tracking-wider mb-2">
                      {tScanner("shift")}
                    </div>
                    <pre className="text-[10px] font-mono text-violet-300/80 leading-tight overflow-hidden">
                      {card.code}
                    </pre>
                  </div>

                  {/* Intent Card (top layer - clips away to reveal Shift) */}
                  <div
                    className="absolute top-0 left-0 origin-top-left rounded-xl border border-white/20 bg-zinc-900 p-5 overflow-hidden"
                    style={{
                      width: 380,
                      height: 250,
                      transform: `scale(${cardScale})`,
                      clipPath: `inset(0 ${clipPercent}% 0 0)`,
                      boxShadow: "inset 0 1px 1px 0 rgba(255,255,255,0.1)"
                    }}
                  >
                    <div className="text-xs font-mono text-blue-400/80 uppercase tracking-wider mb-3">
                      {tScanner("intent")}
                    </div>
                    <p className="text-lg font-medium text-foreground leading-relaxed">
                      &quot;{tScanner(card.intentKey)}&quot;
                    </p>
                    <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2 text-xs text-muted-foreground/60">
                      <span className="w-2 h-2 rounded-full bg-blue-500/50 animate-pulse" />
                      {tScanner(card.categoryKey)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Blur overlays with mask for smooth transition */}
          <div
            className="absolute left-0 top-0 bottom-0 w-32 backdrop-blur-xl z-20 pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to right, black, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, black, transparent)'
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-32 backdrop-blur-xl z-20 pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to left, black, transparent)',
              WebkitMaskImage: 'linear-gradient(to left, black, transparent)'
            }}
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-4 mt-12 sm:flex-row sm:justify-center"
        >
          <Button
            size="lg"
            className="h-12 px-8 text-base"
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t("cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t("demo")}
          </Button>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-500/10 blur-[120px] rounded-full -z-10" />
    </section>
  )
}
