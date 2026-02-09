"use client"

import { useEffect, useRef } from "react"

export function TubesEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        let app: unknown = null

        const init = async () => {
            try {
                // Dynamic import from CDN
                // @ts-expect-error -- external script without types
                const tubesModule = await import(/* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js")
                const TubesCursor = tubesModule.default

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
            // Attempt cleanup if the library exposes a dispose method, though often these simple scripts don't.
            // We just ensure we don't crash.
            if (app && typeof app === 'object' && 'dispose' in app && typeof (app as { dispose: () => void }).dispose === 'function') {
                (app as { dispose: () => void }).dispose()
            }
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-60" />
}
