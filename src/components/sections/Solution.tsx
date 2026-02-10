"use client"

import { motion } from "framer-motion"
import { Crosshair, FileText, FlaskConical, Play, Rocket, Terminal, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import { TiltCard } from "@/components/ui/tilt-card"

const STEPS = [
    { icon: Crosshair, titleKey: "step1Title", descKey: "step1Desc" },
    { icon: Zap, titleKey: "step2Title", descKey: "step2Desc" },
    { icon: FlaskConical, titleKey: "step3Title", descKey: "step3Desc" },
    { icon: Rocket, titleKey: "step4Title", descKey: "step4Desc" },
] as const

export function Solution() {
    const t = useTranslations("Solution")

    return (
        <section id="solution" className="py-20 md:py-24 min-h-dvh flex items-center">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center text-center space-y-4 mb-12 md:mb-14">
                    <div className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        <Terminal className="mr-2 h-4 w-4" />
                        <span>{t("badge")}</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {t("title")}
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">
                        {t("description")}
                    </p>
                </div>
                <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
                    <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: i * 0.1 }}
                                className="flex gap-4 rounded-xl border border-primary/10 bg-card/30 backdrop-blur-md p-4 sm:p-5 transition-all duration-300 hover:bg-card/40 hover:border-primary/20"
                            >
                                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                                    <step.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold sm:text-lg">{t(step.titleKey)}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{t(step.descKey)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="relative w-full max-w-2xl mx-auto">
                        {/* Mobile: Terminal with scroll animation but no tilt */}
                        <motion.div
                            className="lg:hidden relative rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-card-foreground shadow-xl overflow-hidden font-mono ring-1 ring-white/5"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <TerminalContent />
                            {/* Static execute badge */}
                            <div className="absolute bottom-4 right-4">
                                <div className="flex items-center space-x-2 bg-green-500/20 text-green-500 px-3 py-1.5 rounded-full border border-green-500/30 shadow-lg backdrop-blur-md text-xs">
                                    <Play className="h-3 w-3 fill-current" />
                                    <span className="font-bold">{t("executing")}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Desktop: TiltCard with animations */}
                        <TiltCard className="relative z-10 hidden lg:block">
                            <motion.div
                                initial={{ rotateY: -10, opacity: 0 }}
                                whileInView={{ rotateY: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-card-foreground shadow-2xl overflow-hidden font-mono text-sm ring-1 ring-white/5 transition-all duration-500 hover:scale-[1.01] hover:bg-black/45 hover:border-purple-400/25 hover:shadow-[0_0_30px_-14px_rgba(168,85,247,0.24)]"
                            >
                                <TerminalContent />

                                {/* Execute Overlay */}
                                <motion.div
                                    className="absolute bottom-6 right-6"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ delay: 1, type: "spring" }}
                                >
                                    <div className="flex items-center space-x-2 bg-green-500/20 text-green-500 px-4 py-2 rounded-full border border-green-500/30 shadow-lg backdrop-blur-md">
                                        <Play className="h-4 w-4 fill-current" />
                                        <span className="font-bold">{t("executing")}</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </TiltCard>

                        {/* Decoration */}
                        <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full -z-10 hidden lg:block"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function TerminalContent() {
    return (
        <>
            <div className="flex items-center justify-between border-b border-white/10 px-3 sm:px-4 py-2 sm:py-3 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                    <span className="text-xs sm:text-sm text-muted-foreground/80 font-medium">shift.yaml</span>
                </div>
                <div className="flex space-x-1 sm:space-x-1.5">
                    <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#FF5F56] shadow-sm" />
                    <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#FFBD2E] shadow-sm" />
                    <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#27C93F] shadow-sm" />
                </div>
            </div>
            <div className="p-4 sm:p-6 space-y-1 sm:space-y-1.5 text-blue-200/90 font-medium leading-relaxed text-xs sm:text-sm">
                <div><span className="text-purple-400">shift:</span> python-http-timeout-v1</div>
                <div><span className="text-purple-400">scope:</span></div>
                <div className="pl-3 sm:pl-4 border-l border-white/10 ml-1"><span className="text-purple-400">language:</span> python</div>
                <div className="pl-3 sm:pl-4 border-l border-white/10 ml-1"><span className="text-purple-400">framework:</span> fastapi</div>
                <div><span className="text-purple-400">transform:</span></div>
                <div className="pl-3 sm:pl-4 border-l border-white/10 ml-1"><span className="text-purple-400">operator:</span> add-timeout@1.2.0</div>
                <div><span className="text-purple-400">validate:</span></div>
                <div className="pl-3 sm:pl-4 border-l border-white/10 ml-1"><span className="text-purple-400">tests:</span> pytest</div>
                <div><span className="text-purple-400">rollout:</span></div>
                <div className="pl-3 sm:pl-4 border-l border-white/10 ml-1"><span className="text-purple-400">strategy:</span> canary</div>
                <div className="pl-3 sm:pl-4 border-l border-white/10 ml-1"><span className="text-purple-400">waves:</span> [10, 50, 100]</div>
            </div>
        </>
    )
}

