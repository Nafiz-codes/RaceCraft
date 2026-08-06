import type { ReactNode } from 'react'

import CircuitMap from '@/components/dashboard/CircuitMap'
import useCircuit, { type CircuitSelection } from '@/hooks/useCircuit'
import type { TelemetryModel } from '@/types/telemetry'

interface CircuitViewProps {
  selection: CircuitSelection
  telemetry: TelemetryModel[] | undefined
  selectedTelemetryIndex: number
}

export default function CircuitView({
  selection,
  telemetry,
  selectedTelemetryIndex,
}: CircuitViewProps): ReactNode {
  const { data, error, isLoading } = useCircuit(selection)

  let content: ReactNode = (
    <p className="text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
      Select a session to load circuit geometry.
    </p>
  )

  if (isLoading) {
    content = <p className="text-[var(--font-size-small)] text-[var(--color-text-secondary)]">Loading circuit...</p>
  } else if (error) {
    content = <p className="text-[var(--font-size-small)] text-[var(--color-error)]">{error}</p>
  } else if (data && data.points.length > 0) {
    content = (
      <CircuitMap
        points={data.points}
        telemetry={telemetry}
        selectedTelemetryIndex={selectedTelemetryIndex}
      />
    )
  }

  return (
    <section id="circuit-view" aria-labelledby="circuit-view-title" className="flex min-h-[26rem] flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-8 lg:row-span-2">
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">System 3C</p>
        <h2 id="circuit-view-title" className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]">Circuit View</h2>
      </div>
      <div className="mt-[var(--space-lg)] flex-1 border-t border-[var(--color-border)] pt-[var(--space-lg)]">{content}</div>
    </section>
  )
}
