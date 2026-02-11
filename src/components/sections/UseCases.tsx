import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Activity,
    Container,
    Layers,
    Puzzle,
    Server,
    ShieldAlert,
    SquareCode,
    Terminal,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Reveal } from "@/components/ui/reveal"

export async function UseCases() {
    const t = await getTranslations("UseCases")

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
        {
            title: t("codeRefactoring"),
            desc: t("case5Desc"),
            icon: SquareCode,
            badge: t("case5Badge"),
        },
        {
            title: t("observabilityInstrumentation"),
            desc: t("case6Desc"),
            icon: Activity,
            badge: t("case6Badge"),
        },
        {
            title: t("devcontainerStandardization"),
            desc: t("case7Desc"),
            icon: Container,
            badge: t("case7Badge"),
        },
        {
            title: t("sharedCapabilities"),
            desc: t("case8Desc"),
            icon: Puzzle,
            badge: t("case8Badge"),
        },
    ]

    return (
        <section id="use-cases" className="py-24 min-h-dvh flex items-center">
            <div className="container px-4 md:px-6 mx-auto">
                <Reveal className="mb-12 flex flex-col items-center text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        {t("title")}
                    </h2>
                    <p className="mt-4 text-muted-foreground md:text-xl max-w-2xl">
                        {t("description")}
                    </p>
                </Reveal>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {cases.map((item, i) => (
                        <Reveal key={i} delay={(i % 4) * 100} className="h-full">
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
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
