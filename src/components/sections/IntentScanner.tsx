"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import logo from "@/assets/logo.svg"

// ── Constants ──
const MAX_PARTICLES = 400
const PARTICLE_SPAWN_RATE = 0.92
const CARD_SPEED = 0.5
const PARTICLE_SPREAD = 8
const BASE_CARD_WIDTH = 380
const BASE_CARD_HEIGHT = 250
const BASE_CARD_GAP = 48
const BASE_SCANNER_HEIGHT = 300

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
  const highlightedTitle = t.rich("title", {
    intent: (chunks) => <span className="text-primary">{chunks}</span>,
    system: (chunks) => <span className="text-primary">{chunks}</span>,
  })

  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const cardAnimRef = useRef<number>(0)
  const isVisibleRef = useRef(true)
  const posRef = useRef(0)

  const [cardScale, setCardScale] = useState(1)
  const scannerHeightRef = useRef(BASE_SCANNER_HEIGHT)
  const [containerWidth, setContainerWidth] = useState(0)

  // Responsive card scale
  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth
      let s: number
      if (w < 640) s = 0.7
      else if (w < 1024) s = 0.7 + ((w - 640) / (1024 - 640)) * 0.3
      else s = 1
      setCardScale(s)
      scannerHeightRef.current = Math.round(BASE_SCANNER_HEIGHT * s)
    }
    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [])

  const CARD_WIDTH = Math.round(BASE_CARD_WIDTH * cardScale)
  const CARD_HEIGHT = Math.round(BASE_CARD_HEIGHT * cardScale)
  const CARD_GAP = Math.round(BASE_CARD_GAP * cardScale)
  const SCANNER_HEIGHT = Math.round(BASE_SCANNER_HEIGHT * cardScale)
  const SINGLE_SET_WIDTH = (CARD_WIDTH + CARD_GAP) * CARDS_DATA.length

  // IntersectionObserver — pause animations when section is off-screen
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Canvas particle animation
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

    // Pre-render particle gradient texture
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
      x: x + (Math.random() - 0.5) * PARTICLE_SPREAD,
      y: Math.random() * scannerHeightRef.current,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.4,
      life: 1,
      decay: Math.random() * 0.01 + 0.003,
    })

    const animate = () => {
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

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

      // Spawn new particles from scanner
      if (Math.random() < PARTICLE_SPAWN_RATE && particlesRef.current.length < MAX_PARTICLES) {
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

  // Card stream animation — direct DOM manipulation (no setState per frame)
  useEffect(() => {
    if (containerWidth === 0) return

    posRef.current = -SINGLE_SET_WIDTH

    const animateCards = () => {
      if (isVisibleRef.current) {
        posRef.current += CARD_SPEED
        if (posRef.current > 0) {
          posRef.current = -SINGLE_SET_WIDTH
        }
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${posRef.current}px)`
        }
      }
      cardAnimRef.current = requestAnimationFrame(animateCards)
    }

    animateCards()

    return () => cancelAnimationFrame(cardAnimRef.current)
  }, [containerWidth, SINGLE_SET_WIDTH])

  // Calculate clip percentage for card (pure function, no state)
  const getClipPercent = useCallback((index: number): number => {
    const scannerX = containerWidth / 2
    const pos = posRef.current
    const cardStart = pos + index * (CARD_WIDTH + CARD_GAP)
    const cardEnd = cardStart + CARD_WIDTH

    if (cardEnd <= scannerX) return 0
    if (cardStart >= scannerX) return 100
    return ((cardEnd - scannerX) / CARD_WIDTH) * 100
  }, [containerWidth, CARD_WIDTH, CARD_GAP])

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-dvh flex flex-col pt-20 md:pt-28 lg:pt-36 pb-10 md:pb-16 lg:pb-20">
      <div className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col flex-1 justify-center items-center gap-8 md:gap-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <Image src={logo} alt="Fleetu Logo" width={64} height={64} className="w-auto h-10 sm:h-12 md:h-16" />
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold font-logo tracking-tight">Fleetu</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {highlightedTitle}
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

          {/* Card stream — transform set directly via ref, no React re-renders */}
          <div
            ref={trackRef}
            className="absolute top-0 left-0 flex items-center h-full z-5"
            style={{ willChange: "transform", gap: `${CARD_GAP}px` }}
          >
            {LOOPED_CARDS.map((card, index) => (
              <CardItem
                key={index}
                card={card}
                index={index}
                cardWidth={CARD_WIDTH}
                cardHeight={CARD_HEIGHT}
                cardScale={cardScale}
                getClipPercent={getClipPercent}
                tScanner={tScanner}
              />
            ))}
          </div>

          {/* Blur overlays */}
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
          className="flex flex-col gap-3 w-full px-6 sm:flex-row sm:justify-center sm:w-auto sm:gap-4 sm:px-0"
        >
          <Button
            size="lg"
            className="h-12 w-full sm:w-auto px-8 text-base"
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t("cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-full sm:w-auto px-8 text-base"
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

// Extracted card component — avoids re-rendering all 30 cards on every frame
function CardItem({
  card,
  index,
  cardWidth,
  cardHeight,
  cardScale,
  getClipPercent,
  tScanner,
}: {
  card: typeof CARDS_DATA[number]
  index: number
  cardWidth: number
  cardHeight: number
  cardScale: number
  getClipPercent: (index: number) => number
  tScanner: ReturnType<typeof useTranslations>
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const intentRef = useRef<HTMLDivElement>(null)

  // Update clip via rAF polling instead of React state
  useEffect(() => {
    let frameId: number
    const update = () => {
      const pct = getClipPercent(index)
      if (intentRef.current) {
        intentRef.current.style.clipPath = `inset(0 ${pct}% 0 0)`
      }
      frameId = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(frameId)
  }, [getClipPercent, index])

  return (
    <div ref={cardRef} className="relative flex-shrink-0" style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}>
      {/* Shift Card (base layer) */}
      <div
        className="absolute top-0 left-0 origin-top-left rounded-xl border border-violet-500/30 bg-zinc-950/95 backdrop-blur-sm p-5 overflow-hidden"
        style={{ width: BASE_CARD_WIDTH, height: BASE_CARD_HEIGHT, transform: `scale(${cardScale})` }}
      >
        <div className="text-xs font-mono text-violet-400/80 uppercase tracking-wider mb-2">
          {tScanner("shift")}
        </div>
        <pre className="text-[10px] font-mono text-violet-300/80 leading-tight overflow-hidden">
          {card.code}
        </pre>
      </div>

      {/* Intent Card (top layer — clips away to reveal Shift) */}
      <div
        ref={intentRef}
        className="absolute top-0 left-0 origin-top-left rounded-xl border border-white/20 bg-zinc-900 p-5 overflow-hidden"
        style={{
          width: BASE_CARD_WIDTH,
          height: BASE_CARD_HEIGHT,
          transform: `scale(${cardScale})`,
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
}
