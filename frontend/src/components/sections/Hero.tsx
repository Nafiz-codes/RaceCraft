import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { gsap } from "@/lib/gsap";

import SplineHero from "@/components/hero/SplineHero";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export default function Hero(): ReactNode {
  const heroRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // GSAP timeline will be added here in the next step.
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section
      ref={heroRef}
      id="hero"
      spacing="none"
      className="relative h-screen overflow-hidden"
    >
      <SplineHero />

      <Container className="absolute inset-x-0 bottom-1/4 z-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-[var(--space-md)] text-[var(--font-size-small)] font-[var(--font-weight-medium)] uppercase tracking-[0.12em] text-[var(--color-f1-red)]">
            RaceCraft / Formula One Engineering
          </p>

          <h1 className="text-[length:var(--font-size-display)] leading-[var(--line-height-display)] tracking-[-0.03em]">
            Formula One Telemetry.<br />Reimagined.
          </h1>

          <p className="mx-auto mt-[var(--space-lg)] max-w-xl text-[var(--font-size-body-large)] leading-[var(--line-height-body-large)] text-[var(--color-text-secondary)]">
            A focused race-engineering workspace for turning every lap, corner, and signal into clear performance context.
          </p>

          <div className="mt-[var(--space-xl)] flex flex-wrap justify-center gap-[var(--space-md)]">
            <Link to="/dashboard">
              <Button size="lg" className="border-[var(--color-f1-red)] bg-[var(--color-f1-red)] hover:border-[var(--color-f1-red-hover)] hover:bg-[var(--color-f1-red-hover)]">
                Launch Workspace
              </Button>
            </Link>

            <Link to="/drivers">
              <Button size="lg" variant="secondary">
                Explore Drivers
              </Button>
            </Link>
            <Link to="/circuits"><Button size="lg" variant="ghost">Explore Circuits</Button></Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
