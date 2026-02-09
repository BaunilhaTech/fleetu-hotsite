import { setRequestLocale } from 'next-intl/server';
import { Hero } from "@/components/sections/Hero"
import { Problem } from "@/components/sections/Problem"
import { Solution } from "@/components/sections/Solution"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { UseCases } from "@/components/sections/UseCases"
import { CTA } from "@/components/sections/CTA"

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <UseCases />
      <CTA />
    </>
  );
}
