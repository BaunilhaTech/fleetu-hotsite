"use client"

import { GitPullRequest, Search, Shield, Zap, type LucideIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

type StepState = "queued" | "running" | "done" | "watch"
type StepId = "policy" | "enforce" | "monitor" | "guard"

const STEP_ORDER: StepId[] = ["policy", "enforce", "monitor", "guard"]
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)"
const HEADER_OFFSET_PX = 56
const STICKY_TOP_TOLERANCE_PX = 4
const STICKY_FAIL_FRAME_LIMIT = 4
const STICKY_GUARD_PX = 24
const STEP_PROGRESS_LEAD = 0.08
const STEP_PROGRESS_TAIL = 0.08

const STATE_CLASSES: Record<StepState, string> = {
    queued: "border-white/15 bg-white/5 text-muted-foreground",
    running: "border-blue-500/30 bg-blue-500/15 text-blue-300",
    done: "border-green-500/30 bg-green-500/15 text-green-300",
    watch: "border-purple-500/30 bg-purple-500/15 text-purple-300",
}

interface StepDef {
    id: StepId
    icon: LucideIcon
    title: string
    desc: string
}

interface Step extends StepDef {
    state: StepState
    stateLabel: string
}

interface RuntimeEvent {
    id: string
    label: string
    detail: string
    state: StepState
}

function resolveStepState(stepId: StepId, stepIndex: number, activeIndex: number): StepState {
    if (stepIndex < activeIndex) return "done"
    if (stepIndex > activeIndex) return "queued"
    if (stepId === "guard") return "watch"
    return "running"
}

function dotStateClass(state: StepState): string {
    if (state === "done") return "bg-green-400"
    if (state === "watch") return "bg-purple-400"
    if (state === "queued") return "bg-white/40"
    return "bg-blue-400 animate-pulse"
}

function resetPanelInlineStyles(panel: HTMLDivElement | null) {
    if (!panel) return

    panel.style.position = ""
    panel.style.top = ""
    panel.style.left = ""
    panel.style.width = ""
    panel.style.bottom = ""
    panel.style.zIndex = ""
}

export function HowItWorks() {
    const t = useTranslations("HowItWorks")
    const trackRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const rafRef = useRef<number | null>(null)
    const stickyFailFramesRef = useRef(0)
    const jsFallbackActiveRef = useRef(false)

    const [isDesktop, setIsDesktop] = useState(false)
    const [activeStep, setActiveStep] = useState<StepId>(STEP_ORDER[0])

    useEffect(() => {
        const media = window.matchMedia(DESKTOP_MEDIA_QUERY)

        const syncDesktopState = () => {
            setIsDesktop(media.matches)
        }

        syncDesktopState()
        media.addEventListener("change", syncDesktopState)

        return () => {
            media.removeEventListener("change", syncDesktopState)
        }
    }, [])

    useEffect(() => {
        const panelNode = panelRef.current

        if (!isDesktop) {
            resetPanelInlineStyles(panelNode)
            stickyFailFramesRef.current = 0
            jsFallbackActiveRef.current = false
            return
        }

        const runFrame = () => {
            const track = trackRef.current
            const panel = panelRef.current
            if (!track || !panel) return

            const trackRect = track.getBoundingClientRect()
            const panelRect = panel.getBoundingClientRect()
            const scrollY = window.scrollY
            const trackTopAbsolute = scrollY + trackRect.top
            const pinStart = trackTopAbsolute - HEADER_OFFSET_PX
            const pinDistance = Math.max(trackRect.height - panelRect.height, 1)
            const pinEnd = pinStart + pinDistance

            const stepWindowStart = pinStart + pinDistance * STEP_PROGRESS_LEAD
            const stepWindowDistance = Math.max(pinDistance * (1 - STEP_PROGRESS_LEAD - STEP_PROGRESS_TAIL), 1)
            const progress = Math.max(0, Math.min(0.999999, (scrollY - stepWindowStart) / stepWindowDistance))
            const nextIndex = Math.min(STEP_ORDER.length - 1, Math.floor(progress * STEP_ORDER.length))
            const nextStep = STEP_ORDER[nextIndex]
            setActiveStep((current) => (current === nextStep ? current : nextStep))

            if (!jsFallbackActiveRef.current) {
                const supportsSticky = typeof CSS !== "undefined" && CSS.supports?.("position", "sticky")

                if (!supportsSticky) {
                    jsFallbackActiveRef.current = true
                } else {
                    const inPinRange = scrollY >= pinStart + STICKY_GUARD_PX && scrollY <= pinEnd - STICKY_GUARD_PX

                    if (inPinRange) {
                        const stickyLooksWrong = Math.abs(panelRect.top - HEADER_OFFSET_PX) > STICKY_TOP_TOLERANCE_PX
                        stickyFailFramesRef.current = stickyLooksWrong ? stickyFailFramesRef.current + 1 : 0

                        if (stickyFailFramesRef.current >= STICKY_FAIL_FRAME_LIMIT) {
                            jsFallbackActiveRef.current = true
                        }
                    } else {
                        stickyFailFramesRef.current = 0
                    }
                }
            }

            if (!jsFallbackActiveRef.current) {
                resetPanelInlineStyles(panel)
                return
            }

            if (scrollY <= pinStart) {
                panel.style.position = "relative"
                panel.style.top = "0"
                panel.style.left = "0"
                panel.style.width = "100%"
                panel.style.bottom = "auto"
                panel.style.zIndex = ""
                return
            }

            if (scrollY >= pinEnd) {
                panel.style.position = "absolute"
                panel.style.top = `${pinDistance}px`
                panel.style.left = "0"
                panel.style.width = "100%"
                panel.style.bottom = "auto"
                panel.style.zIndex = ""
                return
            }

            panel.style.position = "fixed"
            panel.style.top = `${HEADER_OFFSET_PX}px`
            panel.style.left = `${trackRect.left}px`
            panel.style.width = `${trackRect.width}px`
            panel.style.bottom = "auto"
            panel.style.zIndex = "20"
        }

        const queueFrame = () => {
            if (rafRef.current !== null) return

            rafRef.current = window.requestAnimationFrame(() => {
                rafRef.current = null
                runFrame()
            })
        }

        const onResize = () => {
            stickyFailFramesRef.current = 0
            jsFallbackActiveRef.current = false
            queueFrame()
        }

        runFrame()
        window.addEventListener("scroll", queueFrame, { passive: true })
        window.addEventListener("resize", onResize)

        return () => {
            window.removeEventListener("scroll", queueFrame)
            window.removeEventListener("resize", onResize)

            if (rafRef.current !== null) {
                window.cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }

            resetPanelInlineStyles(panelNode)
            stickyFailFramesRef.current = 0
            jsFallbackActiveRef.current = false
        }
    }, [isDesktop])

    const activeStepIndex = STEP_ORDER.indexOf(activeStep)
    const statusLabels: Record<StepState, string> = {
        queued: t("statusQueued"),
        running: t("statusRunning"),
        done: t("statusDone"),
        watch: t("statusGuarding"),
    }

    const baseSteps: StepDef[] = [
        {
            id: "policy",
            icon: Search,
            title: t("step1"),
            desc: t("step1Desc"),
        },
        {
            id: "enforce",
            icon: Zap,
            title: t("step2"),
            desc: t("step2Desc"),
        },
        {
            id: "monitor",
            icon: GitPullRequest,
            title: t("step3"),
            desc: t("step3Desc"),
        },
        {
            id: "guard",
            icon: Shield,
            title: t("step4"),
            desc: t("step4Desc"),
        },
    ]

    const steps: Step[] = baseSteps.map((step, index) => {
        const state = resolveStepState(step.id, index, activeStepIndex)

        return {
            ...step,
            state,
            stateLabel: statusLabels[state],
        }
    })

    const runtimeByStep: Record<StepId, RuntimeEvent[]> = {
        policy: [
            { id: "policy-1", label: t("policyEvent1"), detail: t("policyEvent1Detail"), state: "running" },
            { id: "policy-2", label: t("policyEvent2"), detail: t("policyEvent2Detail"), state: "running" },
            { id: "policy-3", label: t("policyEvent3"), detail: t("policyEvent3Detail"), state: "queued" },
        ],
        enforce: [
            { id: "enforce-1", label: t("enforceEvent1"), detail: t("enforceEvent1Detail"), state: "done" },
            { id: "enforce-2", label: t("enforceEvent2"), detail: t("enforceEvent2Detail"), state: "running" },
            { id: "enforce-3", label: t("enforceEvent3"), detail: t("enforceEvent3Detail"), state: "running" },
        ],
        monitor: [
            { id: "monitor-1", label: t("monitorEvent1"), detail: t("monitorEvent1Detail"), state: "done" },
            { id: "monitor-2", label: t("monitorEvent2"), detail: t("monitorEvent2Detail"), state: "running" },
            { id: "monitor-3", label: t("monitorEvent3"), detail: t("monitorEvent3Detail"), state: "queued" },
        ],
        guard: [
            { id: "guard-1", label: t("guardEvent1"), detail: t("guardEvent1Detail"), state: "done" },
            { id: "guard-2", label: t("guardEvent2"), detail: t("guardEvent2Detail"), state: "watch" },
            { id: "guard-3", label: t("guardEvent3"), detail: t("guardEvent3Detail"), state: "watch" },
        ],
    }

    const metricsByStep: Record<StepId, Record<"targets" | "waves" | "pullRequests" | "guard", string>> = {
        policy: {
            targets: "842",
            waves: "10/50/100",
            pullRequests: "0",
            guard: t("metricGuardStandby"),
        },
        enforce: {
            targets: "842",
            waves: "10/50/100",
            pullRequests: "32",
            guard: t("metricGuardStandby"),
        },
        monitor: {
            targets: "842",
            waves: "10/50/100",
            pullRequests: "187",
            guard: t("metricGuardPending"),
        },
        guard: {
            targets: "842",
            waves: "10/50/100",
            pullRequests: "187",
            guard: t("metricGuardActive"),
        },
    }

    const activeStepData = steps.find((step) => step.id === activeStep) ?? steps[0]
    const runtimeEvents = runtimeByStep[activeStep]
    const activeMetrics = metricsByStep[activeStep]
    const metrics = [
        { label: t("metricTargets"), value: activeMetrics.targets },
        { label: t("metricWaves"), value: activeMetrics.waves },
        { label: t("metricPullRequests"), value: activeMetrics.pullRequests },
        { label: t("metricGuard"), value: activeMetrics.guard },
    ]

    return (
        <section id="how-it-works" className="relative py-24 min-h-dvh lg:min-h-0 lg:py-0">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-1/4 h-80 w-80 rounded-full bg-primary/15 blur-[120px]" />
                <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <div ref={trackRef} className="relative lg:min-h-[220vh]">
                    <div ref={panelRef} className="w-full lg:sticky lg:top-14">
                        <div className="mb-16 text-center">
                            <div className="mb-4 inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:text-sm">
                                {t("badge")}
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t("title")}</h2>
                            <p className="mt-4 text-muted-foreground md:text-xl">{t("subtitle")}</p>
                        </div>

                        <div className="space-y-4 lg:hidden">
                            {steps.map((step) => {
                                const isActive = step.id === activeStep
                                const mobileEvents = runtimeByStep[step.id]

                                return (
                                    <div
                                        key={`mobile-${step.id}`}
                                        className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                                            isActive ? "border-primary/45 bg-primary/10" : "border-white/10 bg-black/40"
                                        }`}
                                    >
                                        <button type="button" onClick={() => setActiveStep(step.id)} className="w-full text-left">
                                            <div className="mb-3 flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                                                        <step.icon className="h-4 w-4" />
                                                    </div>
                                                    <h3 className="text-base font-semibold leading-tight">{step.title}</h3>
                                                </div>
                                                <span
                                                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                                                        STATE_CLASSES[step.state]
                                                    }`}
                                                >
                                                    {step.stateLabel}
                                                </span>
                                            </div>
                                            <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                                        </button>

                                        {isActive && (
                                            <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-black/30 p-3 font-mono">
                                                {mobileEvents.map((event) => (
                                                    <div key={event.id} className="flex items-center justify-between gap-3 text-xs">
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <span
                                                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotStateClass(
                                                                    event.state
                                                                )}`}
                                                            />
                                                            <span className="truncate text-foreground/90">{event.label}</span>
                                                        </div>
                                                        <span className="shrink-0 text-muted-foreground">{event.detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="hidden lg:block">
                            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 p-5 shadow-2xl ring-1 ring-white/5 backdrop-blur-xl md:p-8 lg:p-10">
                                <div className="pointer-events-none absolute inset-0">
                                    <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                                    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                                </div>

                                <div className="grid gap-8 lg:gap-10 xl:grid-cols-[1.05fr_1.45fr]">
                                    <div className="space-y-4">
                                        {steps.map((step, index) => (
                                            <div key={step.id} className="relative pl-14">
                                                {index < steps.length - 1 && (
                                                    <div className="absolute top-11 left-[20px] h-[calc(100%+8px)] w-px bg-gradient-to-b from-primary/40 to-transparent" />
                                                )}

                                                <div
                                                    className={`absolute top-1 left-0 flex h-10 w-10 items-center justify-center rounded-full border text-primary transition-colors ${
                                                        step.id === activeStep
                                                            ? "border-primary/50 bg-primary/20"
                                                            : "border-primary/30 bg-primary/10"
                                                    }`}
                                                >
                                                    <step.icon className="h-5 w-5" />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setActiveStep(step.id)}
                                                    onFocus={() => setActiveStep(step.id)}
                                                    aria-pressed={step.id === activeStep}
                                                    className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 md:p-5 ${
                                                        step.id === activeStep
                                                            ? "border-primary/45 bg-primary/10 shadow-[0_0_30px_-12px_rgba(124,58,237,0.75)]"
                                                            : "border-white/10 bg-black/40 hover:border-primary/30"
                                                    }`}
                                                >
                                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                                        <h3 className="text-lg font-semibold">{step.title}</h3>
                                                        <span
                                                            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                                                                STATE_CLASSES[step.state]
                                                            }`}
                                                        >
                                                            {step.stateLabel}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50 ring-1 ring-white/5">
                                        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                                                <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                                                <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                                                <span className="ml-2 font-mono text-xs text-muted-foreground">
                                                    {t("runtimeShell")}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/15 px-2 py-0.5 text-[10px] tracking-wide text-blue-200 uppercase">
                                                    {t("runtimeMockBadge")}
                                                </span>
                                                <span className="text-xs font-medium text-primary">{t("runtimeTitle")}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 md:p-6">
                                            <p className="mb-4 text-xs text-muted-foreground">{t("runtimeSubtitle")}</p>
                                            <div className="mb-4 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                                                <span className="text-[11px] text-muted-foreground">{t("runtimeFocusLabel")}:</span>{" "}
                                                <span className="text-xs font-medium text-foreground/90">{activeStepData.title}</span>
                                            </div>

                                            <div className="space-y-3 font-mono">
                                                {runtimeEvents.map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <span
                                                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotStateClass(
                                                                    event.state
                                                                )}`}
                                                            />
                                                            <span className="truncate text-foreground/90">{event.label}</span>
                                                        </div>
                                                        <span className="shrink-0 text-muted-foreground">{event.detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="px-4 pb-4 md:px-6 md:pb-6">
                                            <div className="mb-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                                {metrics.map((metric) => (
                                                    <div
                                                        key={metric.label}
                                                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
                                                    >
                                                        <div className="text-sm font-semibold">{metric.value}</div>
                                                        <div className="text-[11px] text-muted-foreground">{metric.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
