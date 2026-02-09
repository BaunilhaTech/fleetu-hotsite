"use client"

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
            desc: "Migrate 500+ microservices from Node 14 to 18 in a specific rollout wave.",
            icon: Server,
            badge: "Maintenance",
        },
        {
            title: "Security Patching",
            desc: "Detect Log4Shell across the fleet and apply the patch automatically within hours.",
            icon: ShieldAlert,
            badge: "Security",
        },
        {
            title: t("compliance"),
            desc: "Enforce a specific logging library and configuration across all Java services.",
            icon: Layers,
            badge: "Compliance",
        },
        {
            title: "Infrastructure Migration",
            desc: "Update Terraform modules or Kubernetes manifests across the entire organization.",
            icon: Terminal,
            badge: "Infra",
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
                        From security patches to complete refactors, Fleetu handles the complexity of large-scale engineering.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {cases.map((item, i) => (
                        <Card key={i} className="bg-card/30 backdrop-blur-md border-primary/10 transition-all duration-300 hover:scale-[1.02] hover:bg-card/40 hover:border-primary/30 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.2)]">
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
                    ))}
                </div>
            </div>
        </section>
    )
}
