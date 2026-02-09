"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { saveLead } from "@/lib/supabase"

const ROLES = [
    { value: "dev_lead", labelKey: "roleDeveloper" },
    { value: "staff_eng", labelKey: "roleStaff" },
    { value: "platform_eng", labelKey: "rolePlatform" },
    { value: "architect", labelKey: "roleArchitect" },
    { value: "head_eng", labelKey: "roleHead" },
    { value: "other", labelKey: "roleOther" },
]

const FLEET_SIZES = [
    { value: "1-50", labelKey: "fleet50" },
    { value: "50-200", labelKey: "fleet200" },
    { value: "200-500", labelKey: "fleet500" },
    { value: "500+", labelKey: "fleet500plus" },
]

export function CTA() {
    const t = useTranslations("CTA")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [fleetSize, setFleetSize] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !role || !fleetSize) return

        setIsLoading(true)
        setError(null)

        try {
            await saveLead({
                email,
                role,
                fleet_size: fleetSize,
            })
            setIsOpen(true)
            setEmail("")
            setRole("")
            setFleetSize("")
        } catch {
            setError(t("error"))
            console.error("Failed to save lead")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section id="cta" className="py-24 border-t border-white/5 min-h-dvh flex items-center">
            <div className="container px-4 md:px-6 mx-auto text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {t("title")}
                    </h2>
                    <p className="text-muted-foreground md:text-xl">
                        {t("subtitle")}
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto">
                        <Input
                            type="email"
                            placeholder={t("emailPlaceholder")}
                            className="h-12 bg-background"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select value={role} onValueChange={setRole} required>
                                <SelectTrigger className="h-12 bg-background flex-1">
                                    <SelectValue placeholder={t("rolePlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.map((r) => (
                                        <SelectItem key={r.value} value={r.value}>
                                            {t(r.labelKey)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={fleetSize} onValueChange={setFleetSize} required>
                                <SelectTrigger className="h-12 bg-background flex-1">
                                    <SelectValue placeholder={t("fleetPlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {FLEET_SIZES.map((f) => (
                                        <SelectItem key={f.value} value={f.value}>
                                            {t(f.labelKey)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <Button type="submit" size="lg" className="h-12 w-full" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    {t("button")}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-xs text-muted-foreground">
                        {t("privacy")}
                    </p>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center justify-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                        </div>
                        <DialogTitle className="text-center text-xl">{t("successTitle")}</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            {t("successMessage")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center pt-4">
                        <Button onClick={() => setIsOpen(false)} variant="outline">
                            {t("close")}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}
