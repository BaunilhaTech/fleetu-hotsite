import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, isValidLocale } from '../i18n';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !isValidLocale(locale)) {
        locale = defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
        timeZone: 'America/Sao_Paulo'
    };
});
