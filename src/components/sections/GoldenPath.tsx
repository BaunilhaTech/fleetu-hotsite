"use client"

import { useState } from "react"
import {
    AlertTriangle,
    CheckCircle2,
    GitPullRequest,
    Scale,
    Search,
    Shield,
    ShieldCheck,
    Sparkles,
    Zap,
    type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Reveal } from "@/components/ui/reveal"

type GuardMode = "suggestive" | "mandatory"

interface ModeConfig {
    id: GuardMode
    tabLabel: string
    title: string
    description: string
    icon: LucideIcon
    points: string[]
    toneClass: string
}

export function GoldenPath() {
    const t = useTranslations("GoldenPath")
    const [activeMode, setActiveMode] = useState<GuardMode>("suggestive")

    const legacySignals = [t("legacyPoint1"), t("legacyPoint2"), t("legacyPoint3")]
    const flowSteps = [t("flowStep1"), t("flowStep2"), t("flowStep3"), t("flowStep4")]
    const modes: ModeConfig[] = [
        {
            id: "suggestive",
            tabLabel: t("modeSuggestive"),
            title: t("suggestiveTitle"),
            description: t("suggestiveDesc"),
            icon: Sparkles,
            points: [t("suggestiveSignal1"), t("suggestiveSignal2"), t("suggestiveSignal3")],
            toneClass: "border-primary/35 bg-primary/10",
        },
        {
            id: "mandatory",
            tabLabel: t("modeMandatory"),
            title: t("mandatoryTitle"),
            description: t("mandatoryDesc"),
            icon: Shield,
            points: [t("mandatorySignal1"), t("mandatorySignal2"), t("mandatorySignal3")],
            toneClass: "border-amber-500/35 bg-amber-500/10",
        },
    ]
    const activeModeConfig = modes.find((mode) => mode.id === activeMode) ?? modes[0]

    return (
        <section id="golden-path" className="py-20 md:py-24 min-h-dvh flex items-center relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
            </div>

            <div className="container px-4 md:px-6 mx-auto">
                <Reveal className="mx-auto max-w-3xl text-center mb-12 md:mb-14">
                    <div className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        <Scale className="mr-2 h-4 w-4" />
                        {t("badge")}
                    </div>
                    <h2 className="mt-4 text-3xl font-bold tracking-tighter sm:text-5xl">
                        {t("title")}
                    </h2>
                    <p className="mt-4 text-muted-foreground md:text-xl max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </Reveal>

                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
                    <Reveal className="rounded-2xl border border-destructive/25 bg-destructive/5 p-6 backdrop-blur-md">
                        <div className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive mb-4">
                            {t("legacyLabel")}
                        </div>
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive shrink-0">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-semibold">{t("gatekeeperTitle")}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground md:text-base leading-relaxed">
                            {t("gatekeeperDesc")}
                        </p>
                        <div className="mt-5 space-y-3">
                            {legacySignals.map((signal, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm md:text-base">
                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive/80" />
                                    <span>{signal}</span>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal delay={150} className="rounded-2xl border border-primary/35 bg-primary/10 p-6 backdrop-blur-md shadow-[0_0_45px_-20px_hsl(var(--primary)/0.55)]">
                        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary mb-4">
                            {t("goldenLabel")}
                        </div>
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary shrink-0">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-semibold">{t("goldenTitle")}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground md:text-base leading-relaxed">
                            {t("goldenDesc")}
                        </p>

                        <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {modes.map((mode) => (
                                    <button
                                        key={mode.id}
                                        type="button"
                                        onMouseEnter={() => setActiveMode(mode.id)}
                                        onFocus={() => setActiveMode(mode.id)}
                                        onClick={() => setActiveMode(mode.id)}
                                        className={`rounded-lg border px-3 py-2 text-left text-xs sm:text-sm transition-colors ${activeMode === mode.id
                                            ? "border-primary/40 bg-primary/15 text-foreground"
                                            : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-primary/30"
                                            }`}
                                    >
                                        {mode.tabLabel}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={`mt-4 rounded-xl border p-4 ${activeModeConfig.toneClass}`}>
                            <div className="flex items-start gap-3 mb-2">
                                <div className="mt-0.5 text-primary">
                                    <activeModeConfig.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{activeModeConfig.title}</h4>
                                    <p className="mt-1 text-sm text-muted-foreground">{activeModeConfig.description}</p>
                                </div>
                            </div>
                            <div className="mt-3 space-y-2">
                                {activeModeConfig.points.map((point, index) => (
                                    <div key={index} className="flex items-start gap-2 text-sm">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <span>{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">{t("flowTitle")}</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {flowSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-sm flex items-center gap-2"
                                    >
                                        {index === 0 ? (
                                            <Search className="h-4 w-4 text-primary shrink-0" />
                                        ) : index === 1 ? (
                                            <GitPullRequest className="h-4 w-4 text-primary shrink-0" />
                                        ) : index === 2 ? (
                                            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                                        ) : (
                                            <Zap className="h-4 w-4 text-primary shrink-0" />
                                        )}
                                        <span>{step}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                                <div className="h-full w-full rounded-full bg-gradient-to-r from-primary/20 via-primary/80 to-primary/20" />
                            </div>
                        </div>
                    </Reveal>
                </div>

                <Reveal className="mt-6 rounded-xl border border-primary/25 bg-black/35 px-4 py-3 text-sm text-muted-foreground backdrop-blur-md md:text-base">
                    <span className="inline-flex items-center gap-2 text-primary font-medium mr-2">
                        <ShieldCheck className="h-4 w-4" />
                        {t("policyLabel")}
                    </span>
                    {t("policyNote")}
                </Reveal>
            </div>
        </section>
    )
}
