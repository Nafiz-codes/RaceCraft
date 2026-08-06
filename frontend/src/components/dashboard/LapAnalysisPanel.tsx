import { useMemo, type ReactNode } from 'react'

import type { Lap } from '@/types/discovery'
import type { TelemetryModel } from '@/types/telemetry'

interface LapAnalysisPanelProps {
  lap: Lap | undefined
  telemetry: TelemetryModel[] | undefined
}

interface MetricProps {
  label: string
  value: string
}

function Metric({ label, value }: MetricProps): ReactNode {
  return (
    <div className="border border-[var(--color-border)] p-[var(--space-sm)]">
      <dt className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{label}</dt>
      <dd className="mt-1 [font-family:var(--font-family-mono)] text-[var(--font-size-small)] text-[var(--color-text-primary)]">{value}</dd>
    </div>
  )
}

export default function LapAnalysisPanel({ lap, telemetry }: LapAnalysisPanelProps): ReactNode {
  const metrics = useMemo(() => {
    if (!telemetry || telemetry.length === 0) {
      return null
    }

    const totals = telemetry.reduce(
      (current, sample) => ({
        speed: current.speed + sample.speed,
        throttle: current.throttle + sample.throttle,
        topSpeed: Math.max(current.topSpeed, sample.speed),
        minimumSpeed: Math.min(current.minimumSpeed, sample.speed),
        maximumRpm: Math.max(current.maximumRpm, sample.rpm),
        brakeSamples: current.brakeSamples + Number(sample.brake),
        fullThrottleSamples: current.fullThrottleSamples + Number(sample.throttle === 100),
        drsSamples: current.drsSamples + Number(sample.drs >= 10),
      }),
      {
        speed: 0,
        throttle: 0,
        topSpeed: Number.NEGATIVE_INFINITY,
        minimumSpeed: Number.POSITIVE_INFINITY,
        maximumRpm: Number.NEGATIVE_INFINITY,
        brakeSamples: 0,
        fullThrottleSamples: 0,
        drsSamples: 0,
      },
    )
    const sampleCount = telemetry.length

    return [
      ['Top Speed', `${totals.topSpeed.toFixed(1)} km/h`],
      ['Average Speed', `${(totals.speed / sampleCount).toFixed(1)} km/h`],
      ['Minimum Speed', `${totals.minimumSpeed.toFixed(1)} km/h`],
      ['Maximum RPM', `${totals.maximumRpm.toFixed(0)} rpm`],
      ['Average Throttle', `${(totals.throttle / sampleCount).toFixed(1)}%`],
      ['Brake Usage', `${((totals.brakeSamples / sampleCount) * 100).toFixed(1)}%`],
      ['Full Throttle', `${((totals.fullThrottleSamples / sampleCount) * 100).toFixed(1)}%`],
      ['DRS Usage', `${((totals.drsSamples / sampleCount) * 100).toFixed(1)}%`],
    ]
  }, [telemetry])

  return (
    <section id="lap-analysis" aria-labelledby="lap-analysis-title" className="flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-4">
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">System 4D</p>
        <h2 id="lap-analysis-title" className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]">Lap Analysis</h2>
      </div>
      {metrics ? (
        <>
          <p className="mt-[var(--space-md)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Lap {lap?.lapNumber ?? '—'} / {lap?.lapTime ?? '—'}</p>
          <dl className="mt-[var(--space-md)] grid grid-cols-2 gap-[var(--space-sm)] border-t border-[var(--color-border)] pt-[var(--space-md)]">
            {metrics.map(([label, value]) => <Metric key={label} label={label} value={value} />)}
          </dl>
        </>
      ) : (
        <p className="mt-auto border-t border-[var(--color-border)] pt-[var(--space-lg)] text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">Select a primary driver lap to load raw lap metrics.</p>
      )}
    </section>
  )
}
