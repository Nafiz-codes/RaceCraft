import { useMemo, type ReactNode } from 'react'

import type { CircuitCorner } from '@/types/corner'
import type { Lap } from '@/types/discovery'
import type { TelemetryModel } from '@/types/telemetry'

interface EngineeringTimelineProps {
  corners: CircuitCorner[] | undefined
  lap: Lap | undefined
  selectedTelemetryIndex: number
  telemetry: TelemetryModel[]
}

function parseTime(value: string): number | null {
  const match = /^(\d+) days? (\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)$/.exec(value)
  return match ? Number(match[1]) * 86_400 + Number(match[2]) * 3_600 + Number(match[3]) * 60 + Number(match[4]) : null
}

function parseLapTime(value: string | null | undefined): number | null {
  if (!value) return null
  const [minutes, seconds] = value.split(':')
  return Number.isFinite(Number(minutes)) && Number.isFinite(Number(seconds)) ? Number(minutes) * 60 + Number(seconds) : null
}

export default function EngineeringTimeline({ corners, lap, selectedTelemetryIndex, telemetry }: EngineeringTimelineProps): ReactNode {
  const sample = telemetry[selectedTelemetryIndex]
  const lapDistance = telemetry.at(-1)?.distance ?? 1
  const nearestCorner = useMemo(() => {
    if (!sample || !corners?.length) return undefined
    return corners.reduce((nearest, corner) =>
      corner.distance === null || Math.abs(corner.distance - sample.distance) >= Math.abs((nearest.distance ?? Infinity) - sample.distance)
        ? nearest
        : corner,
    )
  }, [corners, sample])
  const sector = useMemo(() => {
    if (!sample || !lap) return '—'
    const start = parseTime(telemetry[0]?.time ?? '')
    const current = parseTime(sample.time)
    const s1 = parseLapTime(lap.sector1Time)
    const s2 = parseLapTime(lap.sector2Time)
    if (start === null || current === null || s1 === null || s2 === null) return '—'
    const elapsed = current - start
    return elapsed <= s1 ? 'S1' : elapsed <= s1 + s2 ? 'S2' : 'S3'
  }, [lap, sample, telemetry])
  const events = useMemo(() => telemetry.flatMap((item, index) => {
    if (index === 0) return []
    const previous = telemetry[index - 1]
    const event = item.brake && !previous.brake ? 'Brake' : item.drs >= 10 && previous.drs < 10 ? 'DRS' : item.gear !== previous.gear ? 'Gear' : item.throttle > 95 && previous.throttle <= 95 ? 'Throttle' : null
    return event ? [{ distance: item.distance, label: event }] : []
  }), [telemetry])
  if (!sample) return null

  const position = `${Math.min((sample.distance / lapDistance) * 100, 100)}%`
  return <section aria-label="Engineering playback timeline" className="mt-[var(--space-lg)] border-y border-[var(--color-border)] py-[var(--space-md)]">
    <div className="flex flex-wrap items-center justify-between gap-[var(--space-sm)]"><p className="rc-type-caption text-[var(--color-primary-purple)]">Engineering Playback</p><p className="rc-type-caption">Lap {lap?.lapNumber ?? '—'} · Sample {selectedTelemetryIndex + 1}</p></div>
    <div className="relative mt-[var(--space-lg)] h-7 border-y border-[var(--color-border)] bg-[var(--color-background-secondary)]" aria-label={`Distance ${Math.round(sample.distance)} metres`}>
      {events.map((event, index) => <span key={`${event.label}-${index}`} title={`${event.label} · ${Math.round(event.distance)}m`} className="absolute inset-y-1 w-px bg-[var(--color-text-muted)] opacity-60" style={{ left: `${Math.min((event.distance / lapDistance) * 100, 100)}%` }} />)}
      {corners?.filter((corner) => corner.distance !== null).map((corner) => <span key={corner.cornerNumber} title={`Turn ${corner.cornerNumber}`} className="absolute inset-y-0 w-px bg-[var(--color-warning)] opacity-70" style={{ left: `${Math.min((corner.distance! / lapDistance) * 100, 100)}%` }} />)}
      <span className="absolute inset-y-[-0.35rem] w-0.5 bg-[var(--color-primary-purple)] shadow-[0_0_10px_var(--color-primary-purple)]" style={{ left: position }}><span className="absolute -left-1.5 -top-1 size-3 rounded-full bg-[var(--color-primary-purple)]" /></span>
    </div>
    <dl className="mt-[var(--space-md)] grid grid-cols-2 gap-x-[var(--space-lg)] gap-y-[var(--space-md)] sm:grid-cols-4 lg:grid-cols-7">
      <div><dt className="rc-metric-label">Corner</dt><dd className="mt-1 text-[var(--font-size-small)]">{nearestCorner ? `Turn ${nearestCorner.cornerNumber}` : '—'}</dd></div>
      <div><dt className="rc-metric-label">Sector</dt><dd className="mt-1 text-[var(--font-size-small)]">{sector}</dd></div>
      <div><dt className="rc-metric-label">Distance</dt><dd className="mt-1 text-[var(--font-size-small)]">{Math.round(sample.distance)} m</dd></div>
      <div><dt className="rc-metric-label">Speed</dt><dd className="mt-1 text-[var(--font-size-small)]">{Math.round(sample.speed)} km/h</dd></div>
      <div><dt className="rc-metric-label">Throttle</dt><dd className="mt-1 text-[var(--font-size-small)]">{Math.round(sample.throttle)}%</dd></div>
      <div><dt className="rc-metric-label">Brake</dt><dd className="mt-1 text-[var(--font-size-small)]">{sample.brake ? 'ON' : 'OFF'}</dd></div>
      <div><dt className="rc-metric-label">Gear</dt><dd className="mt-1 text-[var(--font-size-small)]">{sample.gear}</dd></div>
    </dl>
  </section>
}
