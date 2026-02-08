"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Clock, FileText } from "lucide-react"

export function Problem() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span>The Reality</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        Decisions don&apos;t scale manually.
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        In large organizations, &quot;Policy&quot; often means a PDF that no one reads.
                        Without automation, drift is inevitable.
                    </p>
                </div>

                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                    {[
                        {
                            icon: FileText,
                            title: "Policies become documents",
                            desc: "Standards are defined in wikis but ignored in code reviews.",
                            delay: 0
                        },
                        {
                            icon: Clock,
                            title: "Migrations never end",
                            desc: "Upgrading a framework across 500 repos takes 18 months of meetings.",
                            delay: 0.2
                        },
                        {
                            icon: AlertTriangle,
                            title: "Security Debt accumulates",
                            desc: "Patches rely on teams finding time in their roadmap.",
                            delay: 0.4
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: item.delay, duration: 0.5 }}
                            className="flex flex-col items-center space-y-4 rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <p className="text-center text-muted-foreground">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Drift Visualization */}
                <div className="relative mx-auto max-w-4xl h-64 mt-8 rounded-xl border bg-background/50 overflow-hidden flex flex-col justify-center items-center">
                    <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground">
                        Time vs Compliance
                    </div>

                    {/* Center Line (Intent) */}
                    <div className="absolute w-full h-0.5 bg-primary/50 z-10"></div>
                    <div className="absolute right-4 top-1/2 -translate-y-6 text-primary text-xs font-bold">Intent</div>

                    {/* Drift Lines */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-0.5 bg-muted-foreground/20 w-1/2 left-0"
                            style={{
                                top: "50%",
                                transformOrigin: "left center"
                            }}
                            initial={{ rotate: 0 }}
                            whileInView={{
                                rotate: ((i * 137) % 60) - 30
                            }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, delay: i * 0.05, ease: "easeOut" }}
                        />
                    ))}

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="absolute right-10 text-destructive text-sm font-mono"
                    >
                        ⚠️ Technical Drift Detected
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
