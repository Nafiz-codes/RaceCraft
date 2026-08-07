import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import LandingShowcase from '@/components/sections/LandingShowcase'
import type { ReactNode } from 'react'

export default function LandingLayout(): ReactNode {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <LandingShowcase />
      </main>

      <footer className="border-t border-[var(--color-border)]">
        <Section spacing="xl" background="surface">
          <Container>
            <div className="grid gap-[var(--space-xl)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
              <div className="max-w-sm">
                <a
                  href="#hero"
                  className="text-[var(--font-size-heading-5)] font-[var(--font-weight-bold)] tracking-[-0.03em] text-[var(--color-text-primary)] hover:text-[var(--color-f1-red)] focus-visible:rounded-[var(--radius-sm)]"
                >
                  RaceCraft
                </a>
                <p className="mt-[var(--space-md)] text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
                  Formula One telemetry analysis for drivers, engineers, and curious minds.
                </p>
              </div>

              <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-[var(--space-md)] sm:grid-cols-3">
                <a
                  href="#hero"
                  className="text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] text-[var(--color-text-secondary)] hover:text-[var(--color-f1-red)] active:text-[var(--color-f1-red)]"
                >
                  Home
                </a>
                <a
                  href="#drivers"
                  className="text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] text-[var(--color-text-secondary)] hover:text-[var(--color-f1-red)] active:text-[var(--color-f1-red)]"
                >
                  Drivers
                </a>
                <a
                  href="#circuits"
                  className="text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] text-[var(--color-text-secondary)] hover:text-[var(--color-f1-red)] active:text-[var(--color-f1-red)]"
                >
                  Circuits
                </a>
                <a
                  href="#telemetry-preview"
                  className="text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] text-[var(--color-text-secondary)] hover:text-[var(--color-f1-red)] active:text-[var(--color-f1-red)]"
                >
                  Telemetry
                </a>
                <a
                  href="#about"
                  className="text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] text-[var(--color-text-secondary)] hover:text-[var(--color-f1-red)] active:text-[var(--color-f1-red)]"
                >
                  About
                </a>
              </nav>
            </div>

            <div className="mt-[var(--space-xl)] flex flex-col gap-[var(--space-sm)] border-t border-[var(--color-border)] pt-[var(--space-md)] text-[var(--font-size-caption)] text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 RaceCraft</p>
              <p>Think Like an Engineer.</p>
            </div>
          </Container>
        </Section>
      </footer>
    </>
  )
}
