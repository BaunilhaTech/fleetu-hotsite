"use client"

import { GitPullRequest, Search, Shield, Zap } from "lucide-react"
import { useTranslations } from "next-intl"

export function HowItWorks() {
    const t = useTranslations("HowItWorks")

    const steps = [
        {
            icon: Search,
            title: t("step1"),
            desc: "Fleetu continuously scans your entire codebase. Use metadata to target specific subsets (e.g., 'all nodejs-14 repos').",
        },
        {
            icon: Zap,
            title: t("step2"),
            desc: "Apply automated transformations (Operators). From simple search-and-replace to complex AST refactors via LLMs.",
        },
        {
            icon: GitPullRequest,
            title: t("step3"),
            desc: "Changes are verified in isolated CI environments. If successful, Fleetu opens a PR or commits directly.",
        },
        {
            icon: Shield,
            title: "4. Guard",
            desc: "Once a Shift is applied, Fleetu monitors for regression, automatically correcting any drift.",
        },
    ]

    return (
        <section id="how-it-works" className="py-24 min-h-screen flex items-center">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        {t("title")}
                    </h2>
                    <p className="mt-4 text-muted-foreground md:text-xl">
                        Turn ad-hoc tasks into a repeatable industrial process.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center space-y-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary shadow-glow">
                                <step.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {step.desc}
                            </p>

                            {/* Connector Line (Desktop) */}
                            {i < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-border -z-10" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
