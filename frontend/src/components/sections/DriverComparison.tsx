import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import type { ReactNode } from 'react'

const drivers = [
  {
    name: 'Max Verstappen',
    team: 'Red Bull Racing',
    bestLap: '1:31.421',
    topSpeed: '334 km/h',
    position: 'P1',
  },
  {
    name: 'Lando Norris',
    team: 'McLaren',
    bestLap: '1:31.639',
    topSpeed: '331 km/h',
    position: 'P2',
  },
] as const

export default function DriverComparison(): ReactNode {
  return (
    <Section id="driver-comparison" spacing="2xl">
      <Container>
        <div className="grid items-center gap-[var(--space-2xl)] lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div className="max-w-xl">
            <p className="text-[var(--font-size-small)] font-[var(--font-weight-medium)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">
              Driver comparison
            </p>
            <h2 className="mt-[var(--space-md)]">Find the time between the drivers.</h2>
            <p className="mt-[var(--space-lg)] text-[var(--font-size-body-large)] leading-[var(--line-height-body-large)] text-[var(--color-text-secondary)]">
              Compare lap performance side by side and identify the signals that separate a fast lap from the field.
            </p>
            <Button className="mt-[var(--space-xl)]" size="lg">
              Compare Drivers
            </Button>
          </div>

          <div className="grid gap-[var(--space-md)] sm:grid-cols-2">
            {drivers.map((driver) => (
              <article
                key={driver.name}
                className="border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-lg)] shadow-[var(--shadow-sm)]"
              >
                <p className="text-[var(--font-size-small)] font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]">
                  {driver.team}
                </p>
                <h3 className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)]">
                  {driver.name}
                </h3>

                <dl className="mt-[var(--space-xl)] grid grid-cols-2 gap-x-[var(--space-lg)] gap-y-[var(--space-md)]">
                  <div>
                    <dt className="text-[var(--font-size-caption)] text-[var(--color-text-muted)]">
                      Best Lap
                    </dt>
                    <dd className="mt-[calc(var(--space-sm)/2)] font-[var(--font-weight-medium)] tabular-nums text-[var(--color-text-primary)]">
                      {driver.bestLap}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--font-size-caption)] text-[var(--color-text-muted)]">
                      Top Speed
                    </dt>
                    <dd className="mt-[calc(var(--space-sm)/2)] font-[var(--font-weight-medium)] tabular-nums text-[var(--color-text-primary)]">
                      {driver.topSpeed}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--font-size-caption)] text-[var(--color-text-muted)]">
                      Position
                    </dt>
                    <dd className="mt-[calc(var(--space-sm)/2)] font-[var(--font-weight-medium)] tabular-nums text-[var(--color-text-primary)]">
                      {driver.position}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
