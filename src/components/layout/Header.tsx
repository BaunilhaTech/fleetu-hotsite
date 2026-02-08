"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
    { name: "Product", href: "#product" },
    { name: "Solutions", href: "#solutions" },
    { name: "Docs", href: "/docs" },
]

export function Header() {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 md:px-8">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Image src="/logo.svg" alt="Fleetu Logo" width={32} height={32} />
                        <span className="hidden font-bold sm:inline-block">
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
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0">
                        <Link href="/" className="flex items-center gap-2 px-4">
                            <Image src="/logo.svg" alt="Fleetu Logo" width={32} height={32} />
                            <span className="font-bold">Fleetu</span>
                        </Link>
                        <nav className="mt-8 flex flex-col gap-4 px-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-foreground/70 transition-colors hover:text-foreground"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search or other items could go here */}
                    </div>
                    <nav className="flex items-center">
                        <Button>Request Access</Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}
