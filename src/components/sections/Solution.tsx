"use client"

import { motion } from "framer-motion"
import { Check, Play } from "lucide-react"
import { useTranslations } from "next-intl"

export function Solution() {
    const t = useTranslations("Solution")

    return (
        <section id="solution" className="py-24 min-h-screen flex items-center">
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
                                "Targeting: Define scope via metadata (e.g., 'framework: react')",
                                "Action: Apply automated refactors or patches",
                                "Validation: Run tests in isolated containers",
                                "Rollout: Execute in waves to prevent outages"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative">
                        {/* Code Block */}
                        <motion.div
                            initial={{ rotateY: -10, opacity: 0 }}
                            whileInView={{ rotateY: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="rounded-xl border bg-card text-card-foreground shadow-2xl overflow-hidden font-mono text-sm"
                        >
                            <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/50">
                                <div className="flex items-center space-x-2">
                                    <FileIcon className="h-4 w-4 text-blue-400" />
                                    <span className="text-muted-foreground">shift.yaml</span>
                                </div>
                                <div className="flex space-x-1">
                                    <div className="h-2 w-2 rounded-full bg-red-500/50" />
                                    <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                                    <div className="h-2 w-2 rounded-full bg-green-500/50" />
                                </div>
                            </div>
                            <div className="p-6 space-y-1 text-blue-300">
                                <div><span className="text-purple-400">shift:</span> python-http-timeout-v1</div>
                                <div><span className="text-purple-400">scope:</span></div>
                                <div className="pl-4"><span className="text-purple-400">language:</span> python</div>
                                <div className="pl-4"><span className="text-purple-400">framework:</span> fastapi</div>
                                <div><span className="text-purple-400">transform:</span></div>
                                <div className="pl-4"><span className="text-purple-400">operator:</span> add-timeout@1.2.0</div>
                                <div><span className="text-purple-400">validate:</span></div>
                                <div className="pl-4"><span className="text-purple-400">tests:</span> pytest</div>
                                <div><span className="text-purple-400">rollout:</span></div>
                                <div className="pl-4"><span className="text-purple-400">strategy:</span> canary</div>
                                <div className="pl-4"><span className="text-purple-400">waves:</span> [10, 50, 100]</div>
                            </div>

                            {/* Execute Overlay */}
                            <motion.div
                                className="absolute bottom-6 right-6"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ delay: 1, type: "spring" }}
                            >
                                <div className="flex items-center space-x-2 bg-green-500/20 text-green-500 px-4 py-2 rounded-full border border-green-500/30 shadow-lg backdrop-blur-md">
                                    <Play className="h-4 w-4 fill-current" />
                                    <span className="font-bold">Executing...</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Decoratiodn */}
                        <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full -z-10"></div>
                    </div>
                </div>
            </div>
        </section>
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
