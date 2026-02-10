"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import logo from "@/assets/logo.svg"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import LanguageSwitcher from "./LanguageSwitcher"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export function Header() {
    const pathname = usePathname()
    const t = useTranslations("Header")
    const locale = useLocale()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navItems = [
        { name: t("problem"), href: "#problem" },
        { name: t("goldenPath"), href: "#golden-path" },
        { name: t("product"), href: "#solution" },
        { name: t("howItWorks"), href: "#how-it-works" },
        { name: t("useCases"), href: "#use-cases" },
    ]

    const handleNavClick = (href: string) => {
        setIsMenuOpen(false)
        // Small delay to allow menu close animation before scrolling
        setTimeout(() => {
            const element = document.querySelector(href)
            element?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 md:px-8">
                    <div className="mr-4 hidden lg:flex">
                        <Link href={`/${locale}`} className="mr-6 flex items-center space-x-2">
                            <Image src={logo} alt="Fleetu Logo" width={29} height={32} className="w-auto h-8" />
                            <span className="hidden font-bold sm:inline-block font-[var(--font-logo)] tracking-tight">
                                Fleetu
                            </span>
                        </Link>
                        <nav className="flex items-center gap-6 text-sm">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`transition-colors hover:text-foreground/80 ${pathname === item.href ? "text-foreground" : "text-foreground/60"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
                        onClick={() => setIsMenuOpen(true)}
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
                            <Button onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}>
                                {t("requestAccess")}
                            </Button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Full-Screen Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] lg:hidden"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ backdropFilter: "blur(0px)" }}
                            animate={{ backdropFilter: "blur(20px)" }}
                            exit={{ backdropFilter: "blur(0px)" }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-black/95"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Content */}
                        <div className="relative h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <Link
                                    href={`/${locale}`}
                                    className="flex items-center gap-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Image src={logo} alt="Fleetu Logo" width={29} height={32} className="w-auto h-8" />
                                    <span className="font-bold text-white font-[var(--font-logo)] tracking-tight">Fleetu</span>
                                </Link>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <X className="h-6 w-6 text-white" />
                                    <span className="sr-only">Close Menu</span>
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.1,
                                            ease: "easeOut"
                                        }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                handleNavClick(item.href)
                                            }}
                                            className="group relative text-3xl font-medium text-white/80 hover:text-white transition-colors"
                                        >
                                            {item.name}
                                            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            {/* Footer CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className="p-6 border-t border-white/10"
                            >
                                <Button
                                    className="w-full h-12 text-base"
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                >
                                    {t("requestAccess")}
                                </Button>
                                <div className="mt-4 flex justify-center">
                                    <LanguageSwitcher />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
