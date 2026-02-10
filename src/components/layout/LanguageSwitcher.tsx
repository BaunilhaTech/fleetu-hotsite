"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const languageOptions = [
    { code: "en", label: "English", shortLabel: "EN", countryCode: "US" },
    { code: "br", label: "Português (Brasil)", shortLabel: "BR", countryCode: "BR" },
] as const;

function countryCodeToFlag(countryCode: string) {
    return String.fromCodePoint(
        ...[...countryCode.toUpperCase()].map((char) => 127397 + char.charCodeAt(0))
    );
}

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const changeLocale = (nextLocale: string) => {
        if (nextLocale === locale) {
            return;
        }

        startTransition(() => {
            const segments = pathname.split('/');
            if (segments.length > 1) {
                segments[1] = nextLocale;
            } else {
                segments.push(nextLocale);
            }

            const newPath = segments.join('/') || `/${nextLocale}`;
            const search = window.location.search;
            const hash = window.location.hash;

            router.replace(`${newPath}${search}${hash}`);
        });
    };

    return (
        <div className="relative inline-flex items-center rounded-full border border-primary/25 bg-gradient-to-r from-primary/15 via-background/80 to-primary/10 p-1 shadow-[0_10px_30px_-18px_hsl(var(--primary)/0.7)] backdrop-blur-md">
            <div className="relative grid grid-cols-2 gap-1">
                {languageOptions.map((option) => {
                    const isActive = locale === option.code;

                    return (
                        <button
                            key={option.code}
                            type="button"
                            onClick={() => changeLocale(option.code)}
                            disabled={isPending}
                            aria-label={option.label}
                            aria-pressed={isActive}
                            className={cn(
                                "relative min-w-[42px] lg:min-w-[54px] rounded-full px-2 lg:px-2.5 py-1.5 text-xs font-semibold transition-colors duration-200",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                                isPending && "cursor-wait opacity-70"
                            )}
                        >
                            {isActive ? (
                                <motion.span
                                    layoutId="active-locale-pill"
                                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                    className="absolute inset-0 rounded-full border border-primary/30 bg-primary/20"
                                />
                            ) : null}
                            <span className="relative z-10 inline-flex items-center gap-1">
                                <span aria-hidden>{countryCodeToFlag(option.countryCode)}</span>
                                <span className="hidden lg:inline">{option.shortLabel}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
