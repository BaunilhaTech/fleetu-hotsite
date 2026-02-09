import { setRequestLocale } from 'next-intl/server';
import { IntentScanner } from "@/components/sections/IntentScanner"
import { Problem } from "@/components/sections/Problem"
import { Solution } from "@/components/sections/Solution"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { UseCases } from "@/components/sections/UseCases"
import { CTA } from "@/components/sections/CTA"
import { locales } from "@/i18n"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <IntentScanner />
      <Problem />
      <Solution />
      <HowItWorks />
      <UseCases />
      <CTA />
    </>
  );
}
