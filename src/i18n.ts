export const defaultLocale = 'en';
export const locales = ['en', 'pt-BR'] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

/** Maps route locale to BCP 47 lang attribute */
export function getHtmlLang(locale: Locale): string {
    return locale; // 'en' and 'pt-BR' are already valid BCP 47
}
