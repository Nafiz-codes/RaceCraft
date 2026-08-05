import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import type { ReactNode } from 'react'

const telemetryCards = [
  { label: 'Speed', value: '324 km/h', detail: 'Top speed on the main straight' },
  { label: 'Tire Temperature', value: '96 °C', detail: 'Front-left tyre, optimal range' },
  { label: 'Lap Delta', value: '−0.218 s', detail: 'Ahead of the reference lap' },
] as const

const accentClasses = {
  Speed: 'bg-[var(--color-primary-purple)]',
  'Tire Temperature': 'bg-[var(--color-warning)]',
  'Lap Delta': 'bg-[var(--color-success)]',
} as const

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
                className="relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-xl)] shadow-[var(--shadow-md)]"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-px ${accentClasses[card.label]}`}
                />

                <dl>
                  <dt className="text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                    {card.label}
                  </dt>
                  <dd className="mt-[var(--space-xl)] [font-family:var(--font-family-mono)] text-[length:var(--font-size-heading-2)] font-[var(--font-weight-bold)] leading-[var(--line-height-heading-2)] tabular-nums text-[var(--color-text-primary)]">
                    {card.value}
                  </dd>
                </dl>

                <p className="mt-[var(--space-xl)] border-t border-[var(--color-border)] pt-[var(--space-md)] text-[var(--font-size-caption)] leading-[var(--line-height-caption)] text-[var(--color-text-secondary)]">
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
