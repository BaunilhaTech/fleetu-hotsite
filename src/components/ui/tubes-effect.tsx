"use client"

import { useEffect, useRef } from "react"

export function TubesEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const initializedRef = useRef(false)

    useEffect(() => {
        if (!canvasRef.current || initializedRef.current) return

        initializedRef.current = true
        let app: unknown = null

        const init = async () => {
            try {
                // Dynamic import from CDN
                // @ts-expect-error -- external script without types
                const tubesModule = await import(/* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js")
                const TubesCursor = tubesModule.default

                // Check if component is still mounted before initializing
                if (!canvasRef.current) return

                app = TubesCursor(canvasRef.current, {
                    tubes: {
                        colors: ["#a855f7", "#3b82f6", "#0f172a"], // Purple, Blue, Dark
                        lights: {
                            intensity: 10,
                            colors: ["#a855f7", "#3b82f6"]
                        }
                    }
                })
            } catch (error) {
                console.error("Failed to load Tubes effect:", error)
            }
        }

        init()

        return () => {
            // Attempt cleanup if the library exposes a dispose method
            if (app && typeof app === 'object' && 'dispose' in app && typeof (app as { dispose: () => void }).dispose === 'function') {
                try {
                    (app as { dispose: () => void }).dispose()
                } catch (e) {
                    console.error("Failed to dispose tubes effect:", e)
                }
            }
            // Reset initialization flag on unmount to allow re-initialization if remounted
            initializedRef.current = false
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-60" />
}
