"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { ChangeEvent, useTransition } from "react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            // Replace the current locale in the pathname with the new one
            // This assumes the pathname always starts with `/${locale}`
            const segments = pathname.split('/');
            segments[1] = nextLocale;
            const newPath = segments.join('/');

            router.replace(newPath);
        });
    };

    return (
        <div className="relative flex items-center">
            <Globe className="absolute left-2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
                defaultValue={locale}
                onChange={onSelectChange}
                disabled={isPending}
                className="h-9 w-full appearance-none rounded-md border border-input bg-transparent pl-8 pr-8 py-1 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
                <option value="en" className="bg-background">English</option>
                <option value="pt" className="bg-background">Português</option>
            </select>
        </div>
    );
}
