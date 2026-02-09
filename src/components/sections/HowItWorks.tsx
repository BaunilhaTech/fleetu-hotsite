"use client"

import { motion } from "framer-motion"
import { GitPullRequest, Search, Shield, Zap, type LucideIcon } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"

type StepState = "queued" | "running" | "done" | "watch"
type StepId = "policy" | "enforce" | "monitor" | "guard"

const STEP_ORDER: StepId[] = ["policy", "enforce", "monitor", "guard"]

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

function resolveStepState(stepId: StepId, index: number, activeIndex: number): StepState {
    if (index < activeIndex) {
        return "done"
    }

    if (index > activeIndex) {
        return "queued"
    }

    if (stepId === "guard") {
        return "watch"
    }

    return "running"
}

function dotStateClass(state: StepState): string {
    if (state === "done") {
        return "bg-green-400"
    }

    if (state === "watch") {
        return "bg-purple-400"
    }

    if (state === "queued") {
        return "bg-white/40"
    }

    return "bg-blue-400 animate-pulse"
}

export function HowItWorks() {
    const t = useTranslations("HowItWorks")
    const [activeStep, setActiveStep] = useState<StepId>("enforce")

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
        <section id="how-it-works" className="py-24 min-h-dvh flex items-center relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-primary/15 blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs sm:text-sm font-medium text-primary mb-4">
                        {t("badge")}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        {t("title")}
                    </h2>
                    <p className="mt-4 text-muted-foreground md:text-xl">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="space-y-4 lg:hidden">
                    {steps.map((step, index) => {
                        const isActive = step.id === activeStep
                        const mobileEvents = runtimeByStep[step.id]

                        return (
                            <motion.div
                                key={`mobile-${step.id}`}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: index * 0.08, duration: 0.35 }}
                                className={`rounded-2xl border p-4 text-left transition-all duration-300 ${isActive
                                    ? "border-primary/45 bg-primary/10"
                                    : "border-white/10 bg-black/40"
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => setActiveStep(step.id)}
                                    className="w-full text-left"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                                                <step.icon className="h-4 w-4" />
                                            </div>
                                            <h3 className="text-base font-semibold leading-tight">{step.title}</h3>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] border font-medium shrink-0 ${STATE_CLASSES[step.state]}`}>
                                            {step.stateLabel}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {step.desc}
                                    </p>
                                </button>

                                {isActive && (
                                    <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-black/30 p-3 font-mono">
                                        {mobileEvents.map((event) => (
                                            <div key={event.id} className="flex items-center justify-between gap-3 text-xs">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotStateClass(event.state)}`} />
                                                    <span className="text-foreground/90 truncate">{event.label}</span>
                                                </div>
                                                <span className="text-muted-foreground shrink-0">{event.detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                <div className="hidden lg:block">
                    <div className="relative rounded-3xl border border-white/10 bg-black/35 backdrop-blur-xl p-5 md:p-8 lg:p-10 shadow-2xl ring-1 ring-white/5 overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                        </div>

                        <div className="grid gap-8 lg:gap-10 xl:grid-cols-[1.05fr_1.45fr]">
                            <div className="space-y-4">
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, x: -16 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ delay: index * 0.1, duration: 0.45 }}
                                        className="relative pl-14"
                                    >
                                        {index < steps.length - 1 && (
                                            <div className="absolute left-[20px] top-11 h-[calc(100%+8px)] w-px bg-gradient-to-b from-primary/40 to-transparent" />
                                        )}

                                        <div className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border text-primary transition-colors ${step.id === activeStep ? "border-primary/50 bg-primary/20" : "border-primary/30 bg-primary/10"}`}>
                                            <step.icon className="h-5 w-5" />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setActiveStep(step.id)}
                                            aria-pressed={step.id === activeStep}
                                            className={`w-full rounded-2xl border p-4 md:p-5 text-left transition-all duration-300 ${step.id === activeStep
                                                ? "border-primary/45 bg-primary/10 shadow-[0_0_30px_-12px_rgba(124,58,237,0.75)]"
                                                : "border-white/10 bg-black/40 hover:border-primary/30"
                                                }`}
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <h3 className="text-lg font-semibold">{step.title}</h3>
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] border font-medium ${STATE_CLASSES[step.state]}`}>
                                                    {step.stateLabel}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5 }}
                                className="rounded-2xl border border-white/10 bg-black/50 overflow-hidden ring-1 ring-white/5"
                            >
                                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                                        <span className="ml-2 text-xs text-muted-foreground font-mono">{t("runtimeShell")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-blue-200">
                                            {t("runtimeMockBadge")}
                                        </span>
                                        <span className="text-xs text-primary font-medium">{t("runtimeTitle")}</span>
                                    </div>
                                </div>

                                <div className="p-4 md:p-6">
                                    <p className="text-xs text-muted-foreground mb-4">
                                        {t("runtimeSubtitle")}
                                    </p>
                                    <div className="mb-4 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                                        <span className="text-[11px] text-muted-foreground">{t("runtimeFocusLabel")}:</span>{" "}
                                        <span className="text-xs text-foreground/90 font-medium">{activeStepData.title}</span>
                                    </div>

                                    <div className="space-y-3 font-mono">
                                        {runtimeEvents.map((event, index) => (
                                            <motion.div
                                                key={event.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.12, duration: 0.35 }}
                                                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotStateClass(event.state)}`} />
                                                    <span className="text-foreground/90 truncate">{event.label}</span>
                                                </div>
                                                <span className="text-muted-foreground shrink-0">{event.detail}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-4 md:px-6 pb-4 md:pb-6">
                                    <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-4" />
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {metrics.map((metric) => (
                                            <div key={metric.label} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                                                <div className="text-sm font-semibold">{metric.value}</div>
                                                <div className="text-[11px] text-muted-foreground">{metric.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
