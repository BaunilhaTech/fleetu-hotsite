"use client"

import { motion } from "framer-motion"
import { GitPullRequest, Search, Shield, Zap, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"

type StepState = "queued" | "running" | "done" | "watch"

const STATE_CLASSES: Record<StepState, string> = {
    queued: "border-white/15 bg-white/5 text-muted-foreground",
    running: "border-blue-500/30 bg-blue-500/15 text-blue-300",
    done: "border-green-500/30 bg-green-500/15 text-green-300",
    watch: "border-purple-500/30 bg-purple-500/15 text-purple-300",
}

interface Step {
    icon: LucideIcon
    title: string
    desc: string
    state: StepState
    stateLabel: string
}

export function HowItWorks() {
    const t = useTranslations("HowItWorks")

    const steps: Step[] = [
        {
            icon: Search,
            title: t("step1"),
            desc: t("step1Desc"),
            state: "queued",
            stateLabel: t("statusQueued"),
        },
        {
            icon: Zap,
            title: t("step2"),
            desc: t("step2Desc"),
            state: "running",
            stateLabel: t("statusRunning"),
        },
        {
            icon: GitPullRequest,
            title: t("step3"),
            desc: t("step3Desc"),
            state: "done",
            stateLabel: t("statusMerged"),
        },
        {
            icon: Shield,
            title: t("step4"),
            desc: t("step4Desc"),
            state: "watch",
            stateLabel: t("statusGuarding"),
        },
    ]

    const runtimeEvents = [
        { key: "scan", message: steps[0].title, detail: "842 targets", state: "running" as const },
        { key: "transform", message: steps[1].title, detail: "518/842 applied", state: "running" as const },
        { key: "review", message: steps[2].title, detail: "187 PRs opened", state: "done" as const },
        { key: "track", message: steps[3].title, detail: "drift monitor active", state: "watch" as const },
    ]

    const metrics = [
        { label: t("metricTargets"), value: "842" },
        { label: t("metricWaves"), value: "10/50/100" },
        { label: t("metricPullRequests"), value: "187" },
        { label: t("metricGuard"), value: "24/7" },
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

                <div className="relative rounded-3xl border border-white/10 bg-black/35 backdrop-blur-xl p-5 md:p-8 lg:p-10 shadow-2xl ring-1 ring-white/5 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                    </div>

                    <div className="grid gap-8 lg:gap-10 xl:grid-cols-[1.05fr_1.45fr]">
                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ delay: index * 0.1, duration: 0.45 }}
                                    className="relative pl-14"
                                >
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-[20px] top-11 h-[calc(100%+8px)] w-px bg-gradient-to-b from-primary/40 to-transparent" />
                                    )}

                                    <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                                        <step.icon className="h-5 w-5" />
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 md:p-5 text-left transition-colors duration-300 hover:border-primary/30">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <h3 className="text-lg font-semibold">{step.title}</h3>
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] border font-medium ${STATE_CLASSES[step.state]}`}>
                                                {step.stateLabel}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
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
                                    <span className="ml-2 text-xs text-muted-foreground font-mono">pipeline.runtime</span>
                                </div>
                                <span className="text-xs text-primary font-medium">{t("runtimeTitle")}</span>
                            </div>

                            <div className="p-4 md:p-6">
                                <p className="text-xs text-muted-foreground mb-4">
                                    {t("runtimeSubtitle")}
                                </p>

                                <div className="space-y-3 font-mono">
                                    {runtimeEvents.map((event, index) => (
                                        <motion.div
                                            key={event.key}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.12, duration: 0.35 }}
                                            className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${event.state === "done"
                                                        ? "bg-green-400"
                                                        : event.state === "watch"
                                                            ? "bg-purple-400"
                                                            : "bg-blue-400 animate-pulse"
                                                    }`}
                                                />
                                                <span className="text-foreground/90 truncate">{event.message}</span>
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
        </section>
    )
}
