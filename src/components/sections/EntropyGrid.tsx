"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Activity, Shield, ShieldAlert, Clock } from "lucide-react"
import { useTranslations } from "next-intl"

type RepoStatus = "healthy" | "critical" | "recovering"

interface Repo {
    id: number
    status: RepoStatus
}

// Responsive grid sizes: mobile shows less, desktop shows more
const GRID_SIZES = {
    mobile: 48,   // 8x6 grid for mobile
    tablet: 84,   // 12x7 grid for tablet
    desktop: 112  // 16x7 grid for desktop
}

function useGridSize() {
    const [gridSize, setGridSize] = useState(GRID_SIZES.desktop)

    useEffect(() => {
        const updateGridSize = () => {
            if (window.innerWidth < 640) {
                setGridSize(GRID_SIZES.mobile)
            } else if (window.innerWidth < 1024) {
                setGridSize(GRID_SIZES.tablet)
            } else {
                setGridSize(GRID_SIZES.desktop)
            }
        }

        updateGridSize()
        window.addEventListener('resize', updateGridSize)
        return () => window.removeEventListener('resize', updateGridSize)
    }, [])

    return gridSize
}

export function EntropyGrid() {
    const t = useTranslations("EntropyGrid")
    const gridSize = useGridSize()
    const [repos, setRepos] = useState<Repo[]>(
        Array.from({ length: GRID_SIZES.desktop }, (_, i) => ({ id: i, status: "healthy" }))
    )
    // entries derived from state - use only visible items for score
    const visibleRepos = repos.slice(0, gridSize)
    const healthyCount = visibleRepos.filter(r => r.status === "healthy" || r.status === "recovering").length
    const complianceScore = Math.round((healthyCount / gridSize) * 100)

    const [timeElapsed, setTimeElapsed] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
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
        }, 150)

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
        <div className="relative mx-auto mt-8 w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-zinc-950/50 p-4 sm:p-5 backdrop-blur-xl shadow-2xl">
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
                                {visibleRepos.filter(r => r.status === 'critical').length}
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
                                {visibleRepos.filter(r => r.status === 'critical').length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Grid - responsive item count */}
            <div className="grid grid-cols-8 sm:grid-cols-12 lg:grid-cols-16 gap-[2px] sm:gap-[3px]">
                {visibleRepos.map((repo) => (
                    <motion.div
                        key={repo.id}
                        layout
                        onMouseEnter={() => fixRepo(repo.id)}
                        className={cn(
                            "aspect-square rounded-[3px] transition-all duration-500 cursor-crosshair backdrop-blur-md shadow-sm",
                            // Healthy: Dark frosted glass, subtle border
                            repo.status === "healthy" && "bg-black/40 border border-white/5 hover:bg-white/5 hover:border-white/10 hover:shadow-md",
                            // Recovering: Dark emerald glass
                            repo.status === "recovering" && "bg-emerald-950/30 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
                            // Critical: Dark red glass
                            repo.status === "critical" && "bg-red-950/30 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                        )}
                    />
                ))}
            </div>

            <div className="mt-4 sm:mt-6 flex justify-between items-center text-[10px] sm:text-xs text-muted-foreground/50 font-mono">
                <span>{t("fleetStatus")}</span>
                <span className="animate-pulse">● {t("liveData")}</span>
            </div>
        </div>
    )
}

