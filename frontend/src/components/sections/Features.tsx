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
              className="border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-lg)] shadow-[var(--shadow-sm)]"
            >
              <h3 className="text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)]">
                {feature.title}
              </h3>
              <p className="mt-[var(--space-md)] text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}
