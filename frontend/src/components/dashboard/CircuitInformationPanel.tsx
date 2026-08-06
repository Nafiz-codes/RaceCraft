import type { ReactNode } from 'react'

import type { CircuitInformation } from '@/types/circuitInformation'

interface CircuitInformationPanelProps {
  circuit: CircuitInformation | undefined
  error: string | null
  isLoading: boolean
}

function displayValue(value: number | string | null): string {
  return value === null ? 'Unavailable' : String(value)
}

function CircuitInformationMetric({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div className="border border-[var(--color-border)] p-[var(--space-sm)]">
      <dt className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-primary)]">
        {value}
      </dd>
    </div>
  )
}

export default function CircuitInformationPanel({
  circuit,
  error,
  isLoading,
}: CircuitInformationPanelProps): ReactNode {
  let content: ReactNode = (
    <p className="text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
      Select a primary session to load circuit information.
    </p>
  )

  if (isLoading) {
    content = <p className="text-[var(--font-size-small)] text-[var(--color-text-secondary)]">Loading circuit information...</p>
  } else if (error) {
    content = <p className="text-[var(--font-size-small)] text-[var(--color-error)]">{error}</p>
  } else if (circuit) {
    content = (
      <dl className="grid grid-cols-2 gap-[var(--space-sm)]">
        <CircuitInformationMetric label="Circuit Name" value={displayValue(circuit.circuitName)} />
        <CircuitInformationMetric label="Event Name" value={displayValue(circuit.eventName)} />
        <CircuitInformationMetric label="Country" value={displayValue(circuit.country)} />
        <CircuitInformationMetric label="Location" value={displayValue(circuit.location)} />
        <CircuitInformationMetric label="Circuit Length" value={displayValue(circuit.circuitLength)} />
        <CircuitInformationMetric label="Corners" value={displayValue(circuit.numberOfCorners)} />
        <CircuitInformationMetric label="Official Session" value={displayValue(circuit.sessionName)} />
        <CircuitInformationMetric label="Event Date" value={displayValue(circuit.eventDate)} />
      </dl>
    )
  }

  return (
    <section
      id="circuit-information-module"
      aria-labelledby="circuit-information-module-title"
      className="flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-4"
    >
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">
          System 3B
        </p>
        <h2
          id="circuit-information-module-title"
          className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]"
        >
          Circuit Information
        </h2>
      </div>
      <div className="mt-[var(--space-lg)] border-t border-[var(--color-border)] pt-[var(--space-lg)]">
        {content}
      </div>
    </section>
  )
}
