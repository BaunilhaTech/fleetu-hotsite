import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale, locales, getHtmlLang, defaultLocale } from '@/i18n';
import { HtmlLangUpdater } from '@/components/HtmlLangUpdater';

const SITE_URL = 'https://fleetu.io';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = isValidLocale(locale) ? locale : defaultLocale;

  const titles: Record<string, string> = {
    'en': 'Fleetu - Where intent becomes system',
    'pt-BR': 'Fleetu - Onde intenção vira sistema',
  };
  const descriptions: Record<string, string> = {
    'en': 'Engineering governance platform that transforms organizational decisions into executable systems.',
    'pt-BR': 'Plataforma de governança de engenharia que transforma decisões organizacionais em sistemas executáveis.',
  };

  return {
    title: titles[lang] ?? titles['en'],
    description: descriptions[lang] ?? descriptions['en'],
    openGraph: {
      title: titles[lang] ?? titles['en'],
      description: descriptions[lang] ?? descriptions['en'],
      url: `${SITE_URL}/${lang}`,
      siteName: 'Fleetu',
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang] ?? titles['en'],
      description: descriptions[lang] ?? descriptions['en'],
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}`])
      ),
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Set the HTML lang attribute dynamically
  const htmlLang = getHtmlLang(locale);

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <HtmlLangUpdater lang={htmlLang} />
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
