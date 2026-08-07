import type { ReactNode } from 'react'

import CircuitMap from '@/components/dashboard/CircuitMap'
import type { CircuitPayload } from '@/types/circuit'
import type { TelemetryModel } from '@/types/telemetry'
import type { CircuitCorner } from '@/types/corner'

interface CircuitViewProps {
  circuit: CircuitPayload | null
  circuitError: string | null
  isCircuitLoading: boolean
  corners: CircuitCorner[] | undefined
  telemetry: TelemetryModel[] | undefined
  selectedTelemetryIndex: number
  selectedCornerNumber: number | null
}

export default function CircuitView({
  circuit,
  circuitError,
  isCircuitLoading,
  corners,
  telemetry,
  selectedTelemetryIndex,
  selectedCornerNumber,
}: CircuitViewProps): ReactNode {
  let content: ReactNode = (
    <p className="text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
      Select a session to load circuit geometry.
    </p>
  )

  if (isCircuitLoading) {
    content = <p className="text-[var(--font-size-small)] text-[var(--color-text-secondary)]">Loading circuit...</p>
  } else if (circuitError) {
    content = <p className="text-[var(--font-size-small)] text-[var(--color-error)]">{circuitError}</p>
  } else if (circuit && circuit.points.length > 0) {
    content = (
      <CircuitMap
        points={circuit.points}
        corners={corners}
        telemetry={telemetry}
        selectedTelemetryIndex={selectedTelemetryIndex}
        selectedCornerNumber={selectedCornerNumber}
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
