import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import type { ReactNode } from 'react'

const telemetryCards = [
  { label: 'Speed', value: '324 km/h', detail: 'Top speed on the main straight' },
  { label: 'Tire Temperature', value: '96 °C', detail: 'Front-left tyre, optimal range' },
  { label: 'Lap Delta', value: '−0.218 s', detail: 'Ahead of the reference lap' },
] as const

export default function TelemetryPreview(): ReactNode {
  return (
    <Section id="telemetry-preview" spacing="2xl" background="secondary">
      <Container>
        <div className="grid items-center gap-[var(--space-2xl)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="max-w-xl">
            <p className="text-[var(--font-size-small)] font-[var(--font-weight-medium)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">
              Telemetry workspace
            </p>
            <h2 className="mt-[var(--space-md)]">Read the lap at a glance.</h2>
            <p className="mt-[var(--space-lg)] text-[var(--font-size-body-large)] leading-[var(--line-height-body-large)] text-[var(--color-text-secondary)]">
              Focus on the signals that matter, then move from the overview into precise lap-by-lap analysis.
            </p>
          </div>

          <div className="grid gap-[var(--space-md)] sm:grid-cols-3">
            {telemetryCards.map((card) => (
              <article
                key={card.label}
                className="border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-lg)] shadow-[var(--shadow-sm)]"
              >
                <p className="text-[var(--font-size-small)] font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]">
                  {card.label}
                </p>
                <p className="mt-[var(--space-lg)] font-[var(--font-weight-semibold)] text-[var(--font-size-heading-4)] leading-[var(--line-height-heading-4)] tabular-nums text-[var(--color-text-primary)]">
                  {card.value}
                </p>
                <p className="mt-[var(--space-sm)] text-[var(--font-size-caption)] leading-[var(--line-height-caption)] text-[var(--color-text-muted)]">
                  {card.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
