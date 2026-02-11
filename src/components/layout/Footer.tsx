import Image from "next/image"
import logo from "@/assets/logo.svg"
import { getTranslations } from "next-intl/server"
import { Reveal } from "@/components/ui/reveal"

const COPYRIGHT_YEAR = 2026

export async function Footer() {
    const t = await getTranslations("Footer")

    return (
        <footer className="border-t py-6 md:py-0">
            <Reveal className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <Image src={logo} alt="Fleetu Logo" width={22} height={24} className="w-auto h-6" />
                    <span className="font-bold font-logo tracking-tight">Fleetu</span>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                    &copy; {COPYRIGHT_YEAR} Fleetu. {t("copyright")}
                </p>
            </Reveal>
        </footer>
    )
}
