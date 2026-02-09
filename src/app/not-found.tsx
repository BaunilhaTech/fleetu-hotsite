"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TubesEffect } from "@/components/ui/tubes-effect"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground flex flex-col font-sans">
            <TubesEffect />

            <header className="container mx-auto px-4 h-16 flex items-center z-10">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/20 backdrop-blur-sm">
                        <div className="w-5 h-5 bg-gradient-to-br from-primary to-blue-600 rounded-sm" />
                    </div>
                    <span>Fleetu</span>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center z-10 -mt-16">
                <div className="space-y-6 max-w-lg mx-auto backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-white/5">
                    <div className="space-y-2">
                        <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-2xl">
                            404
                        </h1>
                        <h2 className="text-2xl font-bold tracking-tight">System Drift Detected</h2>
                        <p className="text-muted-foreground text-lg">
                            The infrastructure you are looking for has been terminated or never existed.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button asChild size="lg" className="h-12 px-8 text-base">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Return Home
                            </Link>
                        </Button>
                        <Button variant="ghost" size="lg" className="h-12 px-8 text-base" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                    </div>
                </div>
            </main>

            <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground/60 z-10">
                <p>© {new Date().getFullYear()} Fleetu. All systems operational.</p>
            </footer>
        </div>
    )
}
