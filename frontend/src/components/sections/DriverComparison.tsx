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

const teamAccentClasses = {
  'Red Bull Racing': 'bg-[var(--color-primary-purple)]',
  McLaren: 'bg-[var(--color-warning)]',
} as const

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
                tabIndex={0}
                className="group relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-xl)] shadow-[var(--shadow-sm)] transition-[background-color,border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-standard)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:shadow-[var(--shadow-md)] focus-visible:border-[var(--color-primary-purple)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-purple)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-px ${teamAccentClasses[driver.team]}`}
                />

                <p className="text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                  {driver.team}
                </p>
                <h3 className="mt-[var(--space-md)] text-[var(--font-size-heading-4)] leading-[var(--line-height-heading-4)] text-[var(--color-text-primary)]">
                  {driver.name}
                </h3>

                <dl className="mt-[var(--space-2xl)]">
                  <div className="border-y border-[var(--color-border)] py-[var(--space-lg)]">
                    <dt className="text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                      Best Lap
                    </dt>
                    <dd className="mt-[var(--space-md)] [font-family:var(--font-family-mono)] text-[length:var(--font-size-heading-1)] font-[var(--font-weight-bold)] leading-[var(--line-height-heading-1)] tabular-nums text-[var(--color-text-primary)]">
                      {driver.bestLap}
                    </dd>
                  </div>
                  <div className="mt-[var(--space-lg)] grid grid-cols-2 gap-[var(--space-lg)]">
                    <div>
                      <dt className="text-[var(--font-size-caption)] text-[var(--color-text-muted)]">
                        Top Speed
                      </dt>
                      <dd className="mt-[var(--space-sm)] [font-family:var(--font-family-mono)] font-[var(--font-weight-medium)] tabular-nums text-[var(--color-text-primary)]">
                        {driver.topSpeed}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--font-size-caption)] text-[var(--color-text-muted)]">
                        Position
                      </dt>
                      <dd className="mt-[var(--space-sm)] [font-family:var(--font-family-mono)] font-[var(--font-weight-medium)] tabular-nums text-[var(--color-text-primary)]">
                        {driver.position}
                      </dd>
                    </div>
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
