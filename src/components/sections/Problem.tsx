import { AlertTriangle, Clock, FileText } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { EntropyGrid } from "./EntropyGrid"
import { Reveal } from "@/components/ui/reveal"

export async function Problem() {
    const t = await getTranslations("Problem")

    return (
        <section id="problem" className="py-24 min-h-dvh flex items-center">
            <div className="container px-4 md:px-6 mx-auto">
                <Reveal className="flex flex-col items-center justify-center space-y-4 text-center">
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
                </Reveal>

                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                    {[
                        {
                            icon: FileText,
                            title: t("card1Title"),
                            desc: t("card1Desc")
                        },
                        {
                            icon: Clock,
                            title: t("card2Title"),
                            desc: t("card2Desc")
                        },
                        {
                            icon: AlertTriangle,
                            title: t("card3Title"),
                            desc: t("card3Desc")
                        }
                    ].map((item, i) => (
                        <Reveal key={i} delay={i * 100} className="h-full">
                            <div className="flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:space-y-4 rounded-xl border border-primary/10 bg-card/30 backdrop-blur-md p-4 sm:p-6 shadow-sm transition-all duration-300 hover:bg-card/40 hover:border-primary/30 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.2)] h-full">
                                <div className="p-2.5 sm:p-3 rounded-full bg-primary/10 text-primary shrink-0">
                                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="flex flex-col sm:items-center text-left sm:text-center">
                                    <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Entropy Visualization */}
                <Reveal>
                    <EntropyGrid />
                </Reveal>
            </div>
        </section>
    )
}
