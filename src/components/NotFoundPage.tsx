"use client"

import { Button } from "@/components/ui/button"
import { Home, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { MouseEvent } from "react"

interface NotFoundPageProps {
    title?: string
    description?: string
    goBackText?: string
    returnHomeText?: string
    homeHref?: string
    terminalLabels?: {
        error: string
        status: string
        message: string
        action: string
        pathError: string
        returnAction: string
    }
}

export function NotFoundPage({
    title = "Route Not Found",
    description = "The page you're looking for doesn't exist or has been moved.",
    goBackText = "Go Back",
    returnHomeText = "Return to Fleet",
    homeHref = "/en",
    terminalLabels = {
        error: "error",
        status: "status",
        message: "message",
        action: "action",
        pathError: "path does not exist",
        returnAction: "return_to_fleet"
    }
}: NotFoundPageProps) {
    const router = useRouter()

    const handleGoBack = (event: MouseEvent<HTMLAnchorElement>) => {
        if (window.history.length <= 1) {
            return
        }

        event.preventDefault()
        router.back()
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-24 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-500/10 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-lg mx-auto text-center space-y-8">
                {/* Animated 404 */}
                <div className="animate-in fade-in zoom-in-50 duration-500 fill-mode-both relative">
                    <div className="text-[150px] sm:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 leading-none select-none">
                        404
                    </div>

                    {/* Glowing overlay */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both absolute inset-0 flex items-center justify-center">
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-md">
                            <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms] fill-mode-both space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        {title}
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        {description}
                    </p>
                </div>

                {/* Terminal-style error */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-4 font-mono text-sm text-left max-w-sm mx-auto">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-xs text-muted-foreground ml-2">error.log</span>
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm">
                        <div><span className="text-red-400">{terminalLabels.error}:</span> route_not_found</div>
                        <div><span className="text-purple-400">{terminalLabels.status}:</span> 404</div>
                        <div><span className="text-purple-400">{terminalLabels.message}:</span> &quot;{terminalLabels.pathError}&quot;</div>
                        <div><span className="text-green-400">{terminalLabels.action}:</span> {terminalLabels.returnAction}</div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms] fill-mode-both flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline" className="gap-2">
                        <Link href={homeHref} onClick={handleGoBack} prefetch={false}>
                            <ArrowLeft className="w-4 h-4" />
                            {goBackText}
                        </Link>
                    </Button>
                    <Button asChild className="gap-2">
                        <Link href={homeHref} prefetch={false}>
                            <Home className="w-4 h-4" />
                            {returnHomeText}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
