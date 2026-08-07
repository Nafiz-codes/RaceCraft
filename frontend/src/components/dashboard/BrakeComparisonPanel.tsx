import { useMemo, type ReactNode } from 'react'

import type { CircuitCorner } from '@/types/corner'
import type { TelemetryModel } from '@/types/telemetry'

interface BrakeComparisonPanelProps {
  comparisonEnabled: boolean
  corner: CircuitCorner | undefined
  primaryTelemetry: TelemetryModel[] | undefined
  secondaryTelemetry: TelemetryModel[] | undefined
}

interface BrakeMetrics {
  startDistance: number
  duration: number
  maximumBrake: boolean
}

function parseTelemetryTime(time: string): number | null {
  const match = /^(\d+) days? (\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)$/.exec(time)
  if (!match) {
    return null
  }

  const [, days, hours, minutes, seconds] = match
  return (
    Number(days) * 86_400 +
    Number(hours) * 3_600 +
    Number(minutes) * 60 +
    Number(seconds)
  )
}

function getBrakeMetrics(
  telemetry: TelemetryModel[],
  apexDistance: number,
): BrakeMetrics | null {
  const approachStart = apexDistance - 150
  const approachSamples = telemetry
    .map((sample, index) => ({ sample, index }))
    .filter(({ sample }) => sample.distance >= approachStart && sample.distance <= apexDistance)
  const brakeStart = approachSamples.find(({ sample }) => sample.brake)

  if (!brakeStart) {
    return null
  }

  const brakingSamples = telemetry.slice(brakeStart.index, approachSamples.at(-1)!.index + 1)
  const duration = brakingSamples.reduce((total, sample, index, samples) => {
    if (!sample.brake || index === 0) {
      return total
    }

    const previousTime = parseTelemetryTime(samples[index - 1].time)
    const currentTime = parseTelemetryTime(sample.time)
    return previousTime === null || currentTime === null
      ? total
      : total + Math.max(currentTime - previousTime, 0)
  }, 0)

  return {
    startDistance: apexDistance - brakeStart.sample.distance,
    duration,
    maximumBrake: brakingSamples.some((sample) => sample.brake),
  }
}

function BrakeMetricsColumn({ label, metrics }: { label: string; metrics: BrakeMetrics | null }): ReactNode {
  return (
    <section className="min-w-0 border border-[var(--color-border)] p-[var(--space-md)]">
      <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-primary-purple)]">
        {label}
      </p>
      <dl className="mt-[var(--space-sm)] grid gap-[var(--space-sm)] border-t border-[var(--color-border)] pt-[var(--space-sm)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[var(--space-sm)]">
          <dt className="min-w-0 truncate uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Brake Start</dt>
          <dd className="whitespace-nowrap text-right text-[var(--color-text-primary)]">{metrics ? `${metrics.startDistance.toFixed(1)} m` : '—'}</dd>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[var(--space-sm)]">
          <dt className="min-w-0 truncate uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Duration</dt>
          <dd className="whitespace-nowrap text-right text-[var(--color-text-primary)]">{metrics ? `${metrics.duration.toFixed(3)} s` : '—'}</dd>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[var(--space-sm)]">
          <dt className="min-w-0 truncate uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Maximum Brake</dt>
          <dd className="whitespace-nowrap text-right text-[var(--color-text-primary)]">{metrics?.maximumBrake ? 'ON' : 'OFF'}</dd>
        </div>
      </dl>
    </section>
  )
}

export default function BrakeComparisonPanel({
  comparisonEnabled,
  corner,
  primaryTelemetry,
  secondaryTelemetry,
}: BrakeComparisonPanelProps): ReactNode {
  const analysis = useMemo(() => {
    if (
      !comparisonEnabled ||
      !corner ||
      corner.distance === null ||
      !primaryTelemetry ||
      !secondaryTelemetry
    ) {
      return null
    }

    const primary = getBrakeMetrics(primaryTelemetry, corner.distance)
    const secondary = getBrakeMetrics(secondaryTelemetry, corner.distance)
    const brakingDifference =
      primary && secondary ? secondary.startDistance - primary.startDistance : null
    const durationDifference = primary && secondary ? primary.duration - secondary.duration : null

    return { primary, secondary, brakingDifference, durationDifference }
  }, [comparisonEnabled, corner, primaryTelemetry, secondaryTelemetry])

  let content: ReactNode = (
    <p className="text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
      Enable Comparison Mode, load both telemetry laps, and select a corner to compare braking.
    </p>
  )

  if (analysis) {
    const brakingMessage =
      analysis.brakingDifference === null
        ? 'A brake start was not available for both laps.'
        : analysis.brakingDifference === 0
          ? 'Both drivers began braking at the same raw sample distance.'
          : analysis.brakingDifference > 0
            ? `Later braking: Primary by ${analysis.brakingDifference.toFixed(1)} m. Earlier braking: Secondary.`
            : `Later braking: Secondary by ${Math.abs(analysis.brakingDifference).toFixed(1)} m. Earlier braking: Primary.`
    const durationMessage =
      analysis.durationDifference === null
        ? 'Brake duration was not available for both laps.'
        : analysis.durationDifference === 0
          ? 'Both braking durations matched.'
          : analysis.durationDifference > 0
            ? `Primary braked ${analysis.durationDifference.toFixed(3)} s longer.`
            : `Secondary braked ${Math.abs(analysis.durationDifference).toFixed(3)} s longer.`

    content = (
      <>
        <div className="grid gap-[var(--space-sm)] sm:grid-cols-2">
          <BrakeMetricsColumn label="Primary" metrics={analysis.primary} />
          <BrakeMetricsColumn label="Secondary" metrics={analysis.secondary} />
        </div>
        <div className="mt-[var(--space-md)] border-t border-[var(--color-border)] pt-[var(--space-sm)]">
          <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Difference</p>
          <p className="mt-[var(--space-sm)] break-words [font-family:var(--font-family-mono)] text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-primary)]">{brakingMessage}</p>
          <p className="mt-[var(--space-sm)] break-words [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">{durationMessage}</p>
        </div>
      </>
    )
  }

  return (
    <section id="brake-comparison" aria-labelledby="brake-comparison-title" className="flex min-h-48 min-w-0 flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-4">
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">System 3F</p>
        <h2 id="brake-comparison-title" className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]">Brake Point Comparison</h2>
      </div>
      <div className="mt-[var(--space-lg)] border-t border-[var(--color-border)] pt-[var(--space-lg)]">{content}</div>
    </section>
  )
}
