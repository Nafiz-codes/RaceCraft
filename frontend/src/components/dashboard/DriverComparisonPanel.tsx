import type { ReactNode } from 'react'

import type { Driver, Lap } from '@/types/discovery'
import type { TelemetryModel } from '@/types/telemetry'

interface DriverComparisonPanelProps {
  comparisonEnabled: boolean
  primaryDriver: Driver | undefined
  primaryLap: Lap | undefined
  primaryTelemetry: TelemetryModel[] | undefined
  secondaryDriver: Driver | undefined
  secondaryLap: Lap | undefined
  secondaryTelemetry: TelemetryModel[] | undefined
}

interface DriverSummaryCardProps {
  label: 'Primary' | 'Secondary'
  driver: Driver | undefined
  lap: Lap | undefined
  telemetry: TelemetryModel[] | undefined
}

function parseLapTime(lapTime: string | null | undefined): number | null {
  if (!lapTime) {
    return null
  }

  const [minutes, seconds] = lapTime.split(':')
  const numericMinutes = Number(minutes)
  const numericSeconds = Number(seconds)
  return Number.isFinite(numericMinutes) && Number.isFinite(numericSeconds)
    ? numericMinutes * 60 + numericSeconds
    : null
}

function DriverSummaryCard({ label, driver, lap, telemetry }: DriverSummaryCardProps): ReactNode {
  return (
    <section className="border border-[var(--color-border)] p-[var(--space-sm)]">
      <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-primary-purple)]">{label}</p>
      <p className="mt-[var(--space-sm)] truncate text-[var(--font-size-small)] text-[var(--color-text-primary)]">{driver?.fullName ?? 'Awaiting selection'}</p>
      <p className="mt-1 truncate [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{driver?.teamName ?? '—'}</p>
      <dl className="mt-[var(--space-md)] grid grid-cols-2 gap-x-[var(--space-sm)] gap-y-2 border-t border-[var(--color-border)] pt-[var(--space-sm)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)]">
        <div><dt className="uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Lap</dt><dd className="mt-1 text-[var(--color-text-primary)]">{lap?.lapNumber ?? '—'}</dd></div>
        <div><dt className="uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Time</dt><dd className="mt-1 text-[var(--color-text-primary)]">{lap?.lapTime ?? '—'}</dd></div>
        <div><dt className="uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Tyre</dt><dd className="mt-1 text-[var(--color-text-primary)]">{lap?.tyreCompound ?? '—'}</dd></div>
        <div><dt className="uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Samples</dt><dd className="mt-1 text-[var(--color-text-primary)]">{telemetry?.length ?? '—'}</dd></div>
      </dl>
    </section>
  )
}

export default function DriverComparisonPanel({
  comparisonEnabled,
  primaryDriver,
  primaryLap,
  primaryTelemetry,
  secondaryDriver,
  secondaryLap,
  secondaryTelemetry,
}: DriverComparisonPanelProps): ReactNode {
  const primaryTime = parseLapTime(primaryLap?.lapTime)
  const secondaryTime = parseLapTime(secondaryLap?.lapTime)
  const delta = primaryTime !== null && secondaryTime !== null ? primaryTime - secondaryTime : null
  const deltaLabel = delta === null
    ? 'Select both laps to calculate delta.'
    : delta < 0
      ? `Primary Faster by ${Math.abs(delta).toFixed(3)}s`
      : delta > 0
        ? `Secondary Faster by ${delta.toFixed(3)}s`
        : 'Lap times matched'

  return (
    <section id="driver-comparison-module" aria-labelledby="driver-comparison-module-title" className="flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-4">
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">System 2B</p>
        <h2 id="driver-comparison-module-title" className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]">Driver Comparison</h2>
      </div>
      {!comparisonEnabled ? (
        <p className="mt-auto border-t border-[var(--color-border)] pt-[var(--space-lg)] text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">Enable Comparison Mode to load a secondary driver reference.</p>
      ) : (
        <div className="mt-[var(--space-lg)] border-t border-[var(--color-border)] pt-[var(--space-lg)]">
          <div className="grid gap-[var(--space-sm)] sm:grid-cols-2 lg:grid-cols-1">
            <DriverSummaryCard label="Primary" driver={primaryDriver} lap={primaryLap} telemetry={primaryTelemetry} />
            <DriverSummaryCard label="Secondary" driver={secondaryDriver} lap={secondaryLap} telemetry={secondaryTelemetry} />
          </div>
          <div className="mt-[var(--space-md)] border-t border-[var(--color-border)] pt-[var(--space-sm)]">
            <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Lap Time Delta</p>
            <p className="mt-1 [font-family:var(--font-family-mono)] text-[var(--font-size-small)] text-[var(--color-text-primary)]">{deltaLabel}</p>
          </div>
        </div>
      )}
    </section>
  )
}
