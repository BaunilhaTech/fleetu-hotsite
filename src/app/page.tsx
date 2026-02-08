import { Hero } from "@/components/sections/Hero"
import { Problem } from "@/components/sections/Problem"
import { Solution } from "@/components/sections/Solution"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { UseCases } from "@/components/sections/UseCases"
import { CTA } from "@/components/sections/CTA"

export default function Home() {
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
