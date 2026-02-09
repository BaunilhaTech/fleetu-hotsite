"use client"

import { motion } from "framer-motion"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, ShieldAlert, Layers, Terminal } from "lucide-react"
import { useTranslations } from "next-intl"

export function UseCases() {
    const t = useTranslations("UseCases")

    const cases = [
        {
            title: t("standardization"),
            desc: t("case1Desc"),
            icon: Server,
            badge: t("case1Badge"),
        },
        {
            title: t("securityPatching"),
            desc: t("case2Desc"),
            icon: ShieldAlert,
            badge: t("case2Badge"),
        },
        {
            title: t("compliance"),
            desc: t("case3Desc"),
            icon: Layers,
            badge: t("case3Badge"),
        },
        {
            title: t("infraMigration"),
            desc: t("case4Desc"),
            icon: Terminal,
            badge: t("case4Badge"),
        },
    ]

    return (
        <section id="use-cases" className="py-24 min-h-screen flex items-center">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="mb-12 flex flex-col items-center text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        {t("title")}
                    </h2>
                    <p className="mt-4 text-muted-foreground md:text-xl max-w-2xl">
                        {t("description")}
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {cases.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            className="h-full"
                        >
                            <Card className="h-full bg-card/30 backdrop-blur-md border-primary/10 transition-all duration-300 hover:bg-card/40 hover:border-primary/30 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.2)]">
                                <CardHeader>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <Badge variant="outline" className="text-xs">{item.badge}</Badge>
                                    </div>
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardDescription className="pt-2">
                                        {item.desc}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
