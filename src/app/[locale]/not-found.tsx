import { NotFoundPage } from "@/components/NotFoundPage";
import { useLocale, useTranslations } from "next-intl";

export default function LocaleNotFound() {
    const t = useTranslations('NotFound')
    const locale = useLocale()

    return (
        <NotFoundPage
            title={t('title')}
            description={t('description')}
            goBackText={t('goBack')}
            returnHomeText={t('returnHome')}
            homeHref={`/${locale}`}
            terminalLabels={{
                error: t('terminal.error'),
                status: t('terminal.status'),
                message: t('terminal.message'),
                action: t('terminal.action'),
                pathError: t('terminal.pathError'),
                returnAction: t('terminal.returnAction')
            }}
        />
    );
}
