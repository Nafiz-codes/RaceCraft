import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import type { ReactNode } from 'react'

const features = [
  {
    title: 'Telemetry Analysis',
    description: 'Inspect speed, throttle, braking, and power delivery across every meter of a lap.',
  },
  {
    title: 'Driver Comparison',
    description: 'Place two drivers side by side to understand where performance is gained or lost.',
  },
  {
    title: 'Circuit Insights',
    description: 'Explore track characteristics and identify the corners that define lap time.',
  },
  {
    title: 'Race Strategy',
    description: 'Review tyre behaviour and stint context to make each on-track decision clearer.',
  },
  {
    title: 'Session Explorer',
    description: 'Move through seasons, events, and sessions with a focused engineering workflow.',
  },
  {
    title: 'Weather Intelligence',
    description: 'Bring track conditions into the analysis and understand their effect on performance.',
  },
] as const

export default function Features(): ReactNode {
  return (
    <Section id="features" spacing="2xl" background="secondary">
      <Container>
        <div className="max-w-2xl">
          <p className="text-[var(--font-size-small)] font-[var(--font-weight-medium)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">
            Engineering toolkit
          </p>
          <h2 className="mt-[var(--space-md)]">Everything needed to understand a lap.</h2>
        </div>

        <div className="mt-[var(--space-2xl)] grid gap-[var(--space-md)] md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              tabIndex={0}
              className="group relative flex min-h-full flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-xl)] shadow-[var(--shadow-sm)] transition-[background-color,border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-standard)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:shadow-[var(--shadow-md)] focus-visible:border-[var(--color-primary-purple)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-purple)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-secondary)]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-[var(--color-primary-purple)]"
              />
              <h3 className="text-[var(--font-size-heading-4)] leading-[var(--line-height-heading-4)] text-[var(--color-text-primary)]">
                {feature.title}
              </h3>
              <p className="mt-[var(--space-lg)] text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}
