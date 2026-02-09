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
import { CheckCircle2, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function CTA() {
    const t = useTranslations("CTA")
    const [email, setEmail] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            // Log event (fakedoor)
            console.log("Lead captured:", email)
            setIsOpen(true)
            setEmail("")
        }
    }

    return (
        <section className="py-24 bg-primary/5 border-t border-primary/10">
            <div className="container px-4 md:px-6 mx-auto text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {t("title")}
                    </h2>
                    <p className="text-muted-foreground md:text-xl">
                        Join the engineering leaders who are turning intent into system.
                        Request early access to the platform.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row max-w-lg mx-auto">
                        <Input
                            type="email"
                            placeholder="Enter your work email"
                            className="h-12 bg-background"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" size="lg" className="h-12 w-full sm:w-auto">
                            {t("button")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <p className="text-xs text-muted-foreground">
                        By subscribing, you agree to our Terms of Service and Privacy Policy.
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
                        <DialogTitle className="text-center text-xl">Thank you for your interest!</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            We&apos;ve added you to our priority waiting list.
                            Our team will reach out shortly to schedule a demo of the Fleetu platform.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center pt-4">
                        <Button onClick={() => setIsOpen(false)} variant="outline">
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}
