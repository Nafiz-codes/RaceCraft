import { useMemo, type ReactNode } from 'react'

import type { CircuitCorner } from '@/types/corner'
import type { TelemetryModel } from '@/types/telemetry'

interface CornerMetricsPanelProps {
  corner: CircuitCorner | undefined
  telemetry: TelemetryModel[] | undefined
}

interface CornerMetrics {
  entrySpeed: number
  apexSpeed: number
  exitSpeed: number
  minimumGear: number
  maximumRpm: number
  brakeDuration: number
  maximumBrake: boolean
  throttleAtExit: number
  drsAtExit: boolean
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

function Metric({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div className="border border-[var(--color-border)] p-[var(--space-sm)]">
      <dt className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 [font-family:var(--font-family-mono)] text-[var(--font-size-small)] text-[var(--color-text-primary)]">
        {value}
      </dd>
    </div>
  )
}

export default function CornerMetricsPanel({ corner, telemetry }: CornerMetricsPanelProps): ReactNode {
  const metrics = useMemo<CornerMetrics | null>(() => {
    if (!corner || corner.distance === null || !telemetry || telemetry.length === 0) {
      return null
    }

    const entryDistance = corner.distance - 75
    const exitDistance = corner.distance + 75
    const entryIndex = telemetry.findIndex((sample) => sample.distance >= entryDistance)
    const exitIndex = telemetry.findIndex((sample) => sample.distance >= exitDistance)
    const resolvedEntryIndex = entryIndex === -1 ? 0 : entryIndex
    const resolvedExitIndex = exitIndex === -1 ? telemetry.length - 1 : exitIndex
    const apexSamples = telemetry
      .map((sample, index) => ({ sample, index }))
      .filter(({ sample }) => Math.abs(sample.distance - corner.distance!) <= 40)

    if (apexSamples.length === 0) {
      return null
    }

    const apex = apexSamples.reduce((slowest, current) =>
      current.sample.speed < slowest.sample.speed ? current : slowest,
    )
    const analysisSamples = telemetry.slice(resolvedEntryIndex, resolvedExitIndex + 1)
    const entryToApexSamples = telemetry.slice(
      resolvedEntryIndex,
      Math.max(resolvedEntryIndex, apex.index) + 1,
    )
    const brakeDuration = entryToApexSamples.reduce((total, sample, index, samples) => {
      if (!sample.brake || index === 0) {
        return total
      }

      const previousTime = parseTelemetryTime(samples[index - 1].time)
      const currentTime = parseTelemetryTime(sample.time)
      return previousTime === null || currentTime === null
        ? total
        : total + Math.max(currentTime - previousTime, 0)
    }, 0)
    const exitSample = telemetry[resolvedExitIndex]

    return {
      entrySpeed: telemetry[resolvedEntryIndex].speed,
      apexSpeed: apex.sample.speed,
      exitSpeed: exitSample.speed,
      minimumGear: Math.min(...analysisSamples.map((sample) => sample.gear)),
      maximumRpm: Math.max(...analysisSamples.map((sample) => sample.rpm)),
      brakeDuration,
      maximumBrake: entryToApexSamples.some((sample) => sample.brake),
      throttleAtExit: exitSample.throttle,
      drsAtExit: exitSample.drs >= 10,
    }
  }, [corner, telemetry])

  return (
    <section id="corner-metrics" aria-labelledby="corner-metrics-title" className="flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-4">
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">System 3E</p>
        <h2 id="corner-metrics-title" className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]">Corner Performance</h2>
      </div>
      {corner && metrics ? (
        <>
          <dl className="mt-[var(--space-md)] grid grid-cols-2 gap-[var(--space-sm)] border-t border-[var(--color-border)] pt-[var(--space-md)]">
            <Metric label="Corner Number" value={String(corner.cornerNumber)} />
            <Metric label="Corner Letter" value={corner.cornerLetter ?? '—'} />
            <Metric label="Entry Speed" value={`${metrics.entrySpeed.toFixed(1)} km/h`} />
            <Metric label="Minimum Speed (Apex)" value={`${metrics.apexSpeed.toFixed(1)} km/h`} />
            <Metric label="Exit Speed" value={`${metrics.exitSpeed.toFixed(1)} km/h`} />
            <Metric label="Minimum Gear" value={String(metrics.minimumGear)} />
            <Metric label="Maximum RPM" value={metrics.maximumRpm.toFixed(0)} />
            <Metric label="Brake Duration" value={`${metrics.brakeDuration.toFixed(3)} s`} />
            <Metric label="Maximum Brake" value={metrics.maximumBrake ? 'ON' : 'OFF'} />
            <Metric label="Throttle at Exit" value={`${metrics.throttleAtExit.toFixed(1)}%`} />
            <Metric label="DRS at Exit" value={metrics.drsAtExit ? 'OPEN' : 'CLOSED'} />
          </dl>
        </>
      ) : (
        <p className="mt-auto border-t border-[var(--color-border)] pt-[var(--space-lg)] text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
          Select a corner with available primary telemetry to inspect raw corner performance.
        </p>
      )}
    </section>
  )
}
