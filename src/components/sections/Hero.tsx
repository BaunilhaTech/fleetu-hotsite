"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Terminal } from "lucide-react"
import { useTranslations } from "next-intl"

export function Hero() {
    const t = useTranslations("Hero")

    return (
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16">
            <div className="container relative z-10 px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                        >
                            <Terminal className="mr-2 h-4 w-4" />
                            <span>Governance as Code</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                        >
                            {t("title")}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                        >
                            {t("description")}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col gap-4 min-[400px]:flex-row"
                        >
                            <Button size="lg" className="h-12 px-8 text-base">
                                {t("cta")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                                {t("demo")}
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative mx-auto w-full max-w-[600px] lg:max-w-none"
                    >
                        {/* Abstract Pipeline Visualization */}
                        <div className="relative rounded-xl border bg-card/50 backdrop-blur-sm p-2 shadow-2xl overflow-hidden aspect-video transform rotate-1 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="absolute top-0 left-0 w-full h-8 bg-muted/50 border-b flex items-center px-4 space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                                <div className="flex-1 text-xs text-center text-muted-foreground font-mono">pipeline-executor — bash</div>
                            </div>

                            <div className="p-4 pt-12 font-mono text-sm space-y-4">
                                <div className="flex items-center space-x-3 text-muted-foreground/50">
                                    <span>$ fleetu apply shift:upgrade-node-v22</span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-500">✔</span>
                                        <span className="text-foreground">Scanning 1,420 repositories...</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-500">✔</span>
                                        <span className="text-foreground">Found 842 matching targets</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            className="text-primary"
                                        >
                                            ⟳
                                        </motion.span>
                                        <span className="text-primary">Applying transformation... (430/842)</span>
                                    </div>
                                </div>

                                {/* Visual blocks flowing */}
                                <div className="relative h-20 mt-8 border rounded bg-background/50 overflow-hidden">
                                    <div className="absolute inset-0 flex items-center space-x-4 px-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ x: -100, opacity: 0 }}
                                                animate={{ x: 400, opacity: [0, 1, 1, 0] }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    delay: i * 0.6,
                                                    ease: "linear"
                                                }}
                                                className="w-12 h-12 rounded border bg-card flex items-center justify-center text-xs border-red-500/30 text-red-500"
                                            >
                                                v14
                                            </motion.div>
                                        ))}

                                        <div className="absolute left-1/2 -translate-x-1/2 w-12 h-20 bg-primary/20 backdrop-blur-md z-10 flex items-center justify-center border-x border-primary/30">
                                            <Zap className="h-6 w-6 text-primary animate-pulse" />
                                        </div>

                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <motion.div
                                                key={`out-${i}`}
                                                initial={{ x: 300, opacity: 0 }}
                                                animate={{ x: 800, opacity: [0, 1, 1, 0] }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    delay: i * 0.6 + 1.5, // Sync with input
                                                    ease: "linear"
                                                }}
                                                className="absolute w-12 h-12 rounded border bg-card flex items-center justify-center text-xs border-green-500/30 text-green-500"
                                            >
                                                v22
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Back glow */}
                        <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full opacity-50"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

function Zap(props: React.ComponentProps<'svg'>) {
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
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    )
}
