"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Clock, FileText } from "lucide-react"
import { useTranslations } from "next-intl"
import { EntropyGrid } from "./EntropyGrid"

export function Problem() {
    const t = useTranslations("Problem")

    return (
        <section id="solution" className="py-24 min-h-screen flex items-center">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span>{t("badge")}</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        {t("title")}
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {t("description")}
                    </p>
                </div>

                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                    {[
                        {
                            icon: FileText,
                            title: t("card1Title"),
                            desc: t("card1Desc"),
                            delay: 0
                        },
                        {
                            icon: Clock,
                            title: t("card2Title"),
                            desc: t("card2Desc"),
                            delay: 0.2
                        },
                        {
                            icon: AlertTriangle,
                            title: t("card3Title"),
                            desc: t("card3Desc"),
                            delay: 0.4
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: item.delay, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex flex-col items-center space-y-4 rounded-xl border border-primary/10 bg-card/30 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:bg-card/40 hover:border-primary/30 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.2)] h-full"
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

                {/* Entropy Visualization */}
                <EntropyGrid />
            </div>
        </section>
    )
}
