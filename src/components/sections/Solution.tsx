"use client"

import { motion } from "framer-motion"
import { Check, Play } from "lucide-react"
import { useTranslations } from "next-intl"
import { TiltCard } from "@/components/ui/tilt-card"

export function Solution() {
    const t = useTranslations("Solution")

    return (
        <section id="solution" className="py-24 min-h-dvh flex items-center">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            {t("title")}
                        </h2>
                        <p className="text-muted-foreground md:text-xl">
                            {t("description")}
                        </p>
                        <ul className="space-y-4">
                            {[
                                t("item1"),
                                t("item2"),
                                t("item3"),
                                t("item4")
                            ].map((item, i) => (
                                <li key={i} className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative">
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
                                className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-card-foreground shadow-2xl overflow-hidden font-mono text-sm ring-1 ring-white/5 transition-all duration-500 hover:scale-[1.02] hover:bg-black/50 hover:border-purple-500/30 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]"
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
                        <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full -z-10"></div>
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
                    <FileIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
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

function FileIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    )
}
