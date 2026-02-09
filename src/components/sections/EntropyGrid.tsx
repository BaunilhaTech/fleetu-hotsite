"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Activity, Shield, ShieldAlert, Clock } from "lucide-react"

type RepoStatus = "healthy" | "critical" | "recovering"

interface Repo {
    id: number
    status: RepoStatus
}



export function EntropyGrid() {
    const GRID_SIZE = 112 // 16x7 grid
    const [repos, setRepos] = useState<Repo[]>(
        Array.from({ length: GRID_SIZE }, (_, i) => ({ id: i, status: "healthy" }))
    )
    const [complianceScore, setComplianceScore] = useState(100)
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

    // valid repos / total repos
    useEffect(() => {
        const healthyCount = repos.filter(r => r.status === "healthy" || r.status === "recovering").length
        setComplianceScore(Math.round((healthyCount / GRID_SIZE) * 100))
    }, [repos])

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
        <div className="relative mx-auto mt-8 w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-zinc-950/50 p-5 backdrop-blur-xl shadow-2xl">
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className={cn("flex items-center justify-center w-12 h-12 rounded-lg border bg-background/50 backdrop-blur transition-colors duration-500",
                        complianceScore < 90 ? "border-red-500/30 text-red-500" : "border-emerald-500/30 text-emerald-500"
                    )}>
                        {complianceScore < 90 ? <ShieldAlert className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                    </div>
                    <div>
                        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Compliance Score</div>
                        <div className={cn("text-2xl font-bold font-mono transition-colors duration-500",
                            complianceScore < 90 ? "text-red-500" : "text-foreground"
                        )}>
                            {complianceScore}%
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Time Since Audit</div>
                            <div className="text-sm font-mono font-medium">{days}d {hours}h</div>
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-white/10" />
                    <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Active Drifts</div>
                            <div className="text-sm font-mono font-medium text-red-500">
                                {repos.filter(r => r.status === 'critical').length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Grid */}
            <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-14 lg:grid-cols-16 gap-[2px] sm:gap-[3px]">
                {repos.map((repo) => (
                    <motion.div
                        key={repo.id}
                        layout
                        onMouseEnter={() => fixRepo(repo.id)}
                        className={cn(
                            "aspect-square rounded-[3px] transition-all duration-500 cursor-crosshair backdrop-blur-md shadow-sm",
                            // Healthy: Frosted glass, neutral border
                            repo.status === "healthy" && "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-md",
                            // Recovering: Soft emerald glass
                            repo.status === "recovering" && "bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
                            // Critical: Red glass
                            repo.status === "critical" && "bg-red-500/10 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                        )}
                    />
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center text-xs text-muted-foreground/50 font-mono">
                <span>Fleet Status: MONITORING</span>
                <span className="animate-pulse">● Live Data</span>
            </div>
        </div>
    )
}
