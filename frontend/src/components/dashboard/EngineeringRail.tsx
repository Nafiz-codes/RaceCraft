import { useMemo, type ReactNode } from 'react'

import CircuitMap from '@/components/dashboard/CircuitMap'
import type { DashboardSelection } from '@/contexts/dashboardComparisonStore'
import type { CircuitPointModel } from '@/types/circuit'
import type { CircuitCorner } from '@/types/corner'
import type { Driver, Lap } from '@/types/discovery'
import type { TelemetryModel } from '@/types/telemetry'

export interface EngineeringRailState {
  circuitPoints: CircuitPointModel[] | undefined
  corners: CircuitCorner[] | undefined
  driver: Driver | undefined
  lap: Lap | undefined
  selectedCornerNumber: number | null
  selectedTelemetryIndex: number
  selection: DashboardSelection
  telemetry: TelemetryModel[] | undefined
}

interface EngineeringRailProps {
  state: EngineeringRailState | null
}

function parseDuration(value: string | null | undefined): number | null {
  if (!value) return null
  const [minutes, seconds] = value.split(':')
  const minuteValue = Number(minutes)
  const secondValue = Number(seconds)
  return Number.isFinite(minuteValue) && Number.isFinite(secondValue)
    ? minuteValue * 60 + secondValue
    : null
}

function parseTelemetryTime(value: string): number | null {
  const match = /^(\d+) days? (\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)$/.exec(value)
  if (!match) return null
  const [, days, hours, minutes, seconds] = match
  return Number(days) * 86_400 + Number(hours) * 3_600 + Number(minutes) * 60 + Number(seconds)
}

function RailMetric({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div className="min-w-0 border-t border-[var(--color-border)] py-[var(--space-md)]">
      <dt className="whitespace-nowrap [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{label}</dt>
      <dd title={value} className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap [font-family:var(--font-family-mono)] text-[var(--font-size-small)] text-[var(--color-text-primary)]">{value}</dd>
    </div>
  )
}

export default function EngineeringRail({ state }: EngineeringRailProps): ReactNode {
  const currentSample = useMemo(
    () => state?.telemetry?.[state.selectedTelemetryIndex],
    [state?.selectedTelemetryIndex, state?.telemetry],
  )
  const currentSector = useMemo(() => {
    if (!state?.lap || !state.telemetry || !currentSample) return '—'
    const startTime = parseTelemetryTime(state.telemetry[0]?.time ?? '')
    const currentTime = parseTelemetryTime(currentSample.time)
    const sector1 = parseDuration(state.lap.sector1Time)
    const sector2 = parseDuration(state.lap.sector2Time)
    if (startTime === null || currentTime === null || sector1 === null || sector2 === null) return '—'
    const elapsed = currentTime - startTime
    return elapsed <= sector1 ? 'S1' : elapsed <= sector1 + sector2 ? 'S2' : 'S3'
  }, [currentSample, state?.lap, state?.telemetry])

  return (
    <aside className="hidden min-w-0 overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-background-secondary)] p-[var(--space-lg)] xl:flex xl:min-h-0 xl:flex-col xl:gap-[var(--space-lg)] xl:pt-[5rem]">
      <section className="min-w-0 border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">Engineering Rail</p>
        <h2 className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)]">Live Session</h2>
        <dl className="mt-[var(--space-lg)] grid grid-cols-2 gap-x-[var(--space-lg)]">
          <RailMetric label="Driver" value={state?.driver?.fullName ?? state?.selection.driver ?? '—'} />
          <RailMetric label="Team" value={state?.driver?.teamName ?? '—'} />
          <RailMetric label="Session" value={state?.selection.session ?? '—'} />
          <RailMetric label="Lap" value={state?.lap?.lapNumber ? String(state.lap.lapNumber) : '—'} />
          <RailMetric label="Tyre" value={state?.lap?.tyreCompound ?? '—'} />
          <RailMetric label="Current Sector" value={currentSector} />
          <RailMetric label="Speed" value={currentSample ? `${Math.round(currentSample.speed)} km/h` : '—'} />
          <RailMetric label="Gear" value={currentSample ? String(currentSample.gear) : '—'} />
          <RailMetric label="RPM" value={currentSample ? Math.round(currentSample.rpm).toLocaleString() : '—'} />
          <RailMetric label="Throttle" value={currentSample ? `${Math.round(currentSample.throttle)}%` : '—'} />
          <RailMetric label="Brake" value={currentSample?.brake ? 'ON' : 'OFF'} />
          <RailMetric label="DRS" value={currentSample?.drs && currentSample.drs >= 10 ? 'OPEN' : 'CLOSED'} />
        </dl>
      </section>
      <section className="shrink-0 border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Live Circuit</p>
        <div className="mt-[var(--space-sm)] h-[240px] w-full shrink-0">
          {state?.circuitPoints ? (
            <CircuitMap
              points={state.circuitPoints}
              corners={state.corners}
              telemetry={state.telemetry}
              selectedTelemetryIndex={state.selectedTelemetryIndex}
              selectedCornerNumber={state.selectedCornerNumber}
              compact
            />
          ) : (
            <p className="py-[var(--space-xl)] text-[var(--font-size-small)] text-[var(--color-text-secondary)]">Select a session to load the circuit.</p>
          )}
        </div>
      </section>
    </aside>
  )
}
