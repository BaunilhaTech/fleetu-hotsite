"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Activity, Shield, ShieldAlert, Clock } from "lucide-react"
import { useTranslations } from "next-intl"

type RepoStatus = "healthy" | "critical" | "recovering"

interface Repo {
    id: number
    status: RepoStatus
}

const TOTAL_REPOS = 112

export function EntropyGrid() {
    const t = useTranslations("EntropyGrid")
    const containerRef = useRef<HTMLDivElement>(null)
    const isVisibleRef = useRef(false)
    const [repos, setRepos] = useState<Repo[]>(
        Array.from({ length: TOTAL_REPOS }, (_, i) => ({ id: i, status: "healthy" }))
    )

    const healthyCount = repos.filter(r => r.status === "healthy" || r.status === "recovering").length
    const complianceScore = Math.round((healthyCount / TOTAL_REPOS) * 100)
    const criticalCount = repos.filter(r => r.status === "critical").length

    const [timeElapsed, setTimeElapsed] = useState(0)

    // Pause simulation when off-screen to save CPU/battery
    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => { isVisibleRef.current = entry.isIntersecting },
            { threshold: 0.05 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isVisibleRef.current) return

            setRepos((currentRepos) => {
                const newRepos = [...currentRepos]
                const randomIndex = Math.floor(Math.random() * newRepos.length)
                const repo = newRepos[randomIndex]

                // Entropy: Healthy nodes failing
                if (repo.status === "healthy" && Math.random() > 0.6) {
                    newRepos[randomIndex] = { ...repo, status: "critical" }
                }

                // Recovery: Temporary fix fading back to healthy (visual only)
                if (repo.status === "recovering") {
                    if (Math.random() > 0.2) newRepos[randomIndex] = { ...repo, status: "healthy" }
                }

                return newRepos
            })

            // Update scorecard
            setTimeElapsed(t => t + 1)
        }, 400)

        return () => clearInterval(interval)
    }, [])

    const fixRepo = (id: number) => {
        setRepos((currentRepos) =>
            currentRepos.map((repo) =>
                repo.id === id ? { ...repo, status: "recovering" } : repo
            )
        )
    }

    // Format time (mocking "days" passing in seconds)
    const days = Math.floor(timeElapsed / 10)
    const hours = (timeElapsed % 24).toString().padStart(2, '0')

    return (
        <div ref={containerRef} className="relative mx-auto mt-8 w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-zinc-950/50 p-4 sm:p-5 backdrop-blur-xl shadow-2xl">
            {/* Dashboard Header */}
            <div className="flex flex-col gap-4 mb-6 sm:mb-8 border-b border-white/5 pb-4 sm:pb-6">
                {/* Compliance Score - prominent on mobile */}
                <div className="flex items-center justify-between sm:justify-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className={cn("flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg border bg-background/50 backdrop-blur transition-colors duration-500",
                            complianceScore < 90 ? "border-red-500/30 text-red-500" : "border-emerald-500/30 text-emerald-500"
                        )}>
                            {complianceScore < 90 ? <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" /> : <Shield className="w-5 h-5 sm:w-6 sm:h-6" />}
                        </div>
                        <div>
                            <div className="text-[10px] sm:text-xs font-mono text-muted-foreground uppercase tracking-wider">{t("complianceScore")}</div>
                            <div className={cn("text-xl sm:text-2xl font-bold font-mono transition-colors duration-500",
                                complianceScore < 90 ? "text-red-500" : "text-foreground"
                            )}>
                                {complianceScore}%
                            </div>
                        </div>
                    </div>

                    {/* Stats row - visible on mobile next to score */}
                    <div className="flex items-center gap-4 sm:hidden">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <div className="text-xs font-mono font-medium">{days}d {hours}h</div>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Activity className="w-3 h-3 text-muted-foreground" />
                            <div className="text-xs font-mono font-medium text-red-500">
                                {criticalCount}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats row - desktop only (expanded version) */}
                <div className="hidden sm:flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t("timeSinceAudit")}</div>
                            <div className="text-sm font-mono font-medium">{days}d {hours}h</div>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t("activeDrifts")}</div>
                            <div className="text-sm font-mono font-medium text-red-500">
                                {criticalCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Grid — CSS aspect-ratio controls visible rows, no JS breakpoint needed */}
            <div className="overflow-hidden aspect-[8/6] sm:aspect-[12/7] lg:aspect-[16/7]">
                <div className="grid grid-cols-8 sm:grid-cols-12 lg:grid-cols-16 gap-[2px] sm:gap-[3px]" role="grid" aria-label="Fleet repository health status">
                    {repos.map((repo) => (
                        <div
                            key={repo.id}
                            role="gridcell"
                            aria-label={`Repository ${repo.id + 1}: ${repo.status}`}
                            onMouseEnter={() => fixRepo(repo.id)}
                            className={cn(
                                "aspect-square rounded-[3px] border transition-colors duration-500 cursor-crosshair",
                                repo.status === "healthy" && "bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/10",
                                repo.status === "recovering" && "bg-emerald-950/30 border-emerald-500/30",
                                repo.status === "critical" && "bg-red-950/30 border-red-500/30"
                            )}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-4 sm:mt-6 flex justify-between items-center text-[10px] sm:text-xs text-muted-foreground/50 font-mono">
                <span>{t("fleetStatus")}</span>
                <span className="animate-pulse">● {t("liveData")}</span>
            </div>
        </div>
    )
}
