"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import logo from "@/assets/logo.svg"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { useEffect, useRef, useState } from "react"

export function Header() {
    const t = useTranslations("Header")
    const locale = useLocale()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [hidden, setHidden] = useState(false)
    const lastYRef = useRef(0)
    const menuContainerRef = useRef<HTMLDivElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const menuDialogId = "mobile-nav-dialog"
    const menuToggleId = "mobile-menu-toggle"

    useEffect(() => {
        const onScroll = () => {
            if (isMenuOpen) return
            const y = window.scrollY
            setHidden(y > 56 && y > lastYRef.current)
            lastYRef.current = y
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [isMenuOpen])

    const navItems = [
        { name: t("problem"), href: "#problem" },
        { name: t("goldenPath"), href: "#golden-path" },
        { name: t("product"), href: "#solution" },
        { name: t("howItWorks"), href: "#how-it-works" },
        { name: t("useCases"), href: "#use-cases" },
    ]

    useEffect(() => {
        if (!isMenuOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        closeButtonRef.current?.focus()

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false)
                return
            }

            if (event.key !== "Tab") return

            const container = menuContainerRef.current
            if (!container) return

            const focusable = Array.from(
                container.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            )
            if (focusable.length === 0) return

            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            const active = document.activeElement as HTMLElement | null

            if (event.shiftKey && active === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && active === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = previousOverflow
            const toggle = document.getElementById(menuToggleId) as HTMLButtonElement | null
            toggle?.focus()
        }
    }, [isMenuOpen])

    return (
        <>
            <header className={`fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
                <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 md:px-8">
                    <div className="mr-4 hidden lg:flex">
                        <Link href={`/${locale}`} className="mr-6 flex items-center space-x-2">
                            <Image src={logo} alt="Fleetu Logo" width={29} height={32} className="w-auto h-8" />
                            <span className="hidden font-bold sm:inline-block font-logo tracking-tight">
                                Fleetu
                            </span>
                        </Link>
                        <nav className="flex items-center gap-6 text-sm">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-foreground/60 transition-colors hover:text-foreground/80"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        id={menuToggleId}
                        variant="ghost"
                        className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
                        onClick={() => setIsMenuOpen(true)}
                        aria-expanded={isMenuOpen}
                        aria-controls={menuDialogId}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>

                    <div className="flex flex-1 items-center justify-between space-x-2 lg:justify-end">
                        <div className="w-full flex-1 lg:w-auto lg:flex-none">
                            {/* Search or other items could go here */}
                        </div>
                        <nav className="flex items-center gap-2">
                            <LanguageSwitcher />
                            <Button asChild>
                                <Link href="#cta">{t("requestAccess")}</Link>
                            </Button>
                        </nav>
                    </div>
                </div>
            </header>

            {isMenuOpen ? (
                <div
                    id={menuDialogId}
                    className="fixed inset-0 z-[100] lg:hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Navigation menu"
                >
                    <div
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    <div ref={menuContainerRef} className="relative h-full flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <Link
                                href={`/${locale}`}
                                className="flex items-center gap-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Image src={logo} alt="Fleetu Logo" width={29} height={32} className="w-auto h-8" />
                                <span className="font-bold text-white font-logo tracking-tight">Fleetu</span>
                            </Link>
                            <button
                                ref={closeButtonRef}
                                type="button"
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="h-6 w-6 text-white" />
                                <span className="sr-only">Close Menu</span>
                            </button>
                        </div>

                        <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="group relative text-3xl font-medium text-white/80 hover:text-white transition-colors"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}
                        </nav>

                        <div className="p-6 border-t border-white/10">
                            <Button asChild className="w-full h-12 text-base">
                                <Link href="#cta" onClick={() => setIsMenuOpen(false)}>
                                    {t("requestAccess")}
                                </Link>
                            </Button>
                            <div className="mt-4 flex justify-center">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
