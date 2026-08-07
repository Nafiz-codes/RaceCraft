import type { CircuitInformation } from '@/types/circuitInformation'
import type { CircuitCorner } from '@/types/corner'
import type { DashboardSelection } from '@/contexts/dashboardComparisonStore'
import type { Driver, Lap } from '@/types/discovery'
import type { TelemetryModel } from '@/types/telemetry'
import type { SessionWeather } from '@/types/weather'

export type ReportFormat = 'markdown' | 'text'

export interface EngineeringInsight {
  category: string
  icon: string
  title: string
  explanation: string
}

export interface SessionReportState {
  comparisonEnabled: boolean
  primarySelection: DashboardSelection
  secondarySelection: DashboardSelection
  primaryDriver: Driver | undefined
  secondaryDriver: Driver | undefined
  primaryLap: Lap | undefined
  secondaryLap: Lap | undefined
  primaryTelemetry: TelemetryModel[] | undefined
  secondaryTelemetry: TelemetryModel[] | undefined
  circuit: CircuitInformation | undefined
  weather: SessionWeather | undefined
  selectedCorner: CircuitCorner | undefined
  insights: EngineeringInsight[]
}

interface TelemetryStats {
  topSpeed: number
  averageSpeed: number
  minimumSpeed: number
  maximumRpm: number
  averageThrottle: number
  brakeUsage: number
  drsUsage: number
  fullThrottleUsage: number
  drsSamples: number
}

interface CornerMetrics {
  entrySpeed: number
  apexSpeed: number
  exitSpeed: number
  minimumGear: number
  brakeDuration: number
  throttleAtExit: number
}

function parseLapTime(value: string | null | undefined): number | null {
  if (!value) return null
  const [minutes, seconds] = value.split(':')
  const minuteValue = Number(minutes)
  const secondValue = Number(seconds)
  return Number.isFinite(minuteValue) && Number.isFinite(secondValue)
    ? minuteValue * 60 + secondValue
    : null
}

function parseTelemetryTime(time: string): number | null {
  const match = /^(\d+) days? (\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)$/.exec(time)
  if (!match) return null
  const [, days, hours, minutes, seconds] = match
  return Number(days) * 86_400 + Number(hours) * 3_600 + Number(minutes) * 60 + Number(seconds)
}

function getTelemetryStats(telemetry: TelemetryModel[]): TelemetryStats {
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
    { speed: 0, throttle: 0, topSpeed: -Infinity, minimumSpeed: Infinity, maximumRpm: -Infinity, brakeSamples: 0, fullThrottleSamples: 0, drsSamples: 0 },
  )
  return {
    topSpeed: totals.topSpeed,
    averageSpeed: totals.speed / telemetry.length,
    minimumSpeed: totals.minimumSpeed,
    maximumRpm: totals.maximumRpm,
    averageThrottle: totals.throttle / telemetry.length,
    brakeUsage: (totals.brakeSamples / telemetry.length) * 100,
    drsUsage: (totals.drsSamples / telemetry.length) * 100,
    fullThrottleUsage: (totals.fullThrottleSamples / telemetry.length) * 100,
    drsSamples: totals.drsSamples,
  }
}

function getCornerApexSpeed(telemetry: TelemetryModel[], corner: CircuitCorner): number | null {
  if (corner.distance === null) return null
  const samples = telemetry.filter((sample) => Math.abs(sample.distance - corner.distance!) <= 40)
  return samples.length ? Math.min(...samples.map((sample) => sample.speed)) : null
}

function getCornerMetrics(telemetry: TelemetryModel[], corner: CircuitCorner): CornerMetrics | null {
  if (corner.distance === null) return null
  const entryIndex = telemetry.findIndex((sample) => sample.distance >= corner.distance! - 75)
  const exitIndex = telemetry.findIndex((sample) => sample.distance >= corner.distance! + 75)
  const resolvedEntry = entryIndex === -1 ? 0 : entryIndex
  const resolvedExit = exitIndex === -1 ? telemetry.length - 1 : exitIndex
  const apex = telemetry
    .map((sample, index) => ({ sample, index }))
    .filter(({ sample }) => Math.abs(sample.distance - corner.distance!) <= 40)
    .reduce<{ sample: TelemetryModel; index: number } | null>(
      (slowest, current) => slowest === null || current.sample.speed < slowest.sample.speed ? current : slowest,
      null,
    )
  if (!apex) return null
  const segment = telemetry.slice(resolvedEntry, resolvedExit + 1)
  const entryToApex = telemetry.slice(resolvedEntry, Math.max(resolvedEntry, apex.index) + 1)
  const brakeDuration = entryToApex.reduce((total, sample, index, samples) => {
    if (!sample.brake || index === 0) return total
    const previous = parseTelemetryTime(samples[index - 1].time)
    const current = parseTelemetryTime(sample.time)
    return previous === null || current === null ? total : total + Math.max(current - previous, 0)
  }, 0)
  return {
    entrySpeed: telemetry[resolvedEntry].speed,
    apexSpeed: apex.sample.speed,
    exitSpeed: telemetry[resolvedExit].speed,
    minimumGear: Math.min(...segment.map((sample) => sample.gear)),
    brakeDuration,
    throttleAtExit: telemetry[resolvedExit].throttle,
  }
}

function getBrakeStart(telemetry: TelemetryModel[], corner: CircuitCorner): number | null {
  if (corner.distance === null) return null
  const sample = telemetry.find((entry) =>
    entry.distance >= corner.distance! - 150 && entry.distance <= corner.distance! && entry.brake,
  )
  return sample ? corner.distance - sample.distance : null
}

export function generateEngineeringInsights({
  comparisonEnabled,
  primaryLap,
  secondaryLap,
  primaryTelemetry,
  secondaryTelemetry,
  selectedCorner,
}: Pick<SessionReportState, 'comparisonEnabled' | 'primaryLap' | 'secondaryLap' | 'primaryTelemetry' | 'secondaryTelemetry' | 'selectedCorner'>): EngineeringInsight[] {
  if (!primaryTelemetry?.length) return []
  const primary = getTelemetryStats(primaryTelemetry)
  const insights: EngineeringInsight[] = []
  if (comparisonEnabled && secondaryTelemetry?.length) {
    const secondary = getTelemetryStats(secondaryTelemetry)
    const speedDelta = primary.topSpeed - secondary.topSpeed
    if (speedDelta) {
      const driver = speedDelta > 0 ? 'Primary' : 'Secondary'
      insights.push({ category: 'Top Speed', icon: 'S', title: `${driver} recorded the higher top speed`, explanation: `${driver} was ${Math.abs(speedDelta).toFixed(1)} km/h faster at peak speed.` })
    }
    const sectors = [
      ['Sector 1', primaryLap?.sector1Time, secondaryLap?.sector1Time],
      ['Sector 2', primaryLap?.sector2Time, secondaryLap?.sector2Time],
      ['Sector 3', primaryLap?.sector3Time, secondaryLap?.sector3Time],
    ].map(([label, primaryTime, secondaryTime]) => {
      const primarySeconds = parseLapTime(primaryTime as string | null | undefined)
      const secondarySeconds = parseLapTime(secondaryTime as string | null | undefined)
      return primarySeconds === null || secondarySeconds === null ? null : { label, delta: primarySeconds - secondarySeconds }
    }).filter((sector): sector is { label: string; delta: number } => sector !== null)
    const largest = sectors.reduce<{ label: string; delta: number } | null>((current, sector) => current === null || Math.abs(sector.delta) > Math.abs(current.delta) ? sector : current, null)
    if (largest && largest.delta) {
      const driver = largest.delta < 0 ? 'Primary' : 'Secondary'
      insights.push({ category: 'Sector Delta', icon: 'Δ', title: `${driver} was quicker in ${largest.label}`, explanation: `${driver} gained ${Math.abs(largest.delta).toFixed(3)} s in the largest sector delta.` })
    }
    const lapDelta = parseLapTime(primaryLap?.lapTime)
    const secondaryLapTime = parseLapTime(secondaryLap?.lapTime)
    if (lapDelta !== null && secondaryLapTime !== null && lapDelta !== secondaryLapTime) {
      const delta = lapDelta - secondaryLapTime
      const driver = delta < 0 ? 'Primary' : 'Secondary'
      insights.push({ category: 'Lap Delta', icon: 'L', title: `${driver} set the faster lap`, explanation: `${driver} was ${Math.abs(delta).toFixed(3)} s quicker overall.` })
    }
    if (selectedCorner) {
      const primaryApex = getCornerApexSpeed(primaryTelemetry, selectedCorner)
      const secondaryApex = getCornerApexSpeed(secondaryTelemetry, selectedCorner)
      if (primaryApex !== null && secondaryApex !== null && primaryApex !== secondaryApex) {
        const driver = primaryApex > secondaryApex ? 'Primary' : 'Secondary'
        insights.push({ category: 'Cornering', icon: 'C', title: `${driver} carried more apex speed`, explanation: `${driver} was ${Math.abs(primaryApex - secondaryApex).toFixed(1)} km/h faster at Turn ${selectedCorner.cornerNumber}.` })
      }
    }
  }
  insights.push(
    { category: 'Top Speed', icon: 'S', title: 'Peak speed recorded', explanation: `Primary reached ${primary.topSpeed.toFixed(1)} km/h in the loaded lap.` },
    { category: 'Braking', icon: 'B', title: 'Brake usage from raw samples', explanation: `Brake was active for ${primary.brakeUsage.toFixed(1)}% of primary telemetry samples.` },
    { category: 'Throttle', icon: 'T', title: 'Full-throttle usage recorded', explanation: `Throttle was at 100% for ${primary.fullThrottleUsage.toFixed(1)}% of primary telemetry samples.` },
    { category: 'Powertrain', icon: 'R', title: 'Maximum engine speed', explanation: `Primary reached ${primary.maximumRpm.toFixed(0)} RPM in the loaded lap.` },
  )
  if (primary.drsSamples) insights.push({ category: 'DRS', icon: 'D', title: 'DRS activation recorded', explanation: `DRS was open in ${primary.drsSamples} raw telemetry samples.` })
  return insights.slice(0, 8)
}

function value(value: string | number | null | undefined): string {
  return value === null || value === undefined || value === '' ? 'Unavailable' : String(value)
}

function section(title: string, lines: string[], format: ReportFormat): string[] {
  return format === 'markdown' ? [`## ${title}`, '', ...lines, ''] : [title, '-'.repeat(40), ...lines, '']
}

export function createSessionReport(state: SessionReportState, format: ReportFormat): string {
  const primaryStats = state.primaryTelemetry?.length ? getTelemetryStats(state.primaryTelemetry) : null
  const cornerMetrics = state.primaryTelemetry && state.selectedCorner ? getCornerMetrics(state.primaryTelemetry, state.selectedCorner) : null
  const primarySectors = [state.primaryLap?.sector1Time, state.primaryLap?.sector2Time, state.primaryLap?.sector3Time]
  const secondarySectors = [state.secondaryLap?.sector1Time, state.secondaryLap?.sector2Time, state.secondaryLap?.sector3Time]
  const lapDelta = parseLapTime(state.primaryLap?.lapTime)
  const secondaryLapTime = parseLapTime(state.secondaryLap?.lapTime)
  const brakePrimary = state.primaryTelemetry && state.selectedCorner ? getBrakeStart(state.primaryTelemetry, state.selectedCorner) : null
  const brakeSecondary = state.secondaryTelemetry && state.selectedCorner ? getBrakeStart(state.secondaryTelemetry, state.selectedCorner) : null
  const line = (label: string, item: string | number | null | undefined) => `${label}: ${value(item)}`
  const lines = [format === 'markdown' ? '# RaceCraft Engineering Session Report' : 'RaceCraft Engineering Session Report', '='.repeat(40), '']
  lines.push(...section('Session Information', [line('Season', state.primarySelection.season), line('Grand Prix', state.primarySelection.event), line('Session', state.primarySelection.session), line('Circuit', state.circuit?.circuitName ?? state.circuit?.location), line('Weather', state.weather ? `${state.weather.airTemperature} °C air / ${state.weather.trackTemperature} °C track / ${state.weather.humidity}% humidity / ${state.weather.windSpeed} m/s wind / ${state.weather.pressure} hPa / ${state.weather.rainfall ? 'Rain' : 'Dry'}` : 'Unavailable')], format))
  lines.push(...section('Driver', [line('Driver Name', state.primaryDriver?.fullName ?? state.primarySelection.driver), line('Team', state.primaryDriver?.teamName), line('Lap Number', state.primaryLap?.lapNumber), line('Tyre Compound', state.primaryLap?.tyreCompound), line('Tyre Life', state.primaryLap?.tyreLife), line('Lap Time', state.primaryLap?.lapTime)], format))
  lines.push(...section('Lap Analysis', primaryStats ? [line('Top Speed', `${primaryStats.topSpeed.toFixed(1)} km/h`), line('Average Speed', `${primaryStats.averageSpeed.toFixed(1)} km/h`), line('Minimum Speed', `${primaryStats.minimumSpeed.toFixed(1)} km/h`), line('Maximum RPM', primaryStats.maximumRpm.toFixed(0)), line('Average Throttle', `${primaryStats.averageThrottle.toFixed(1)}%`), line('Brake Usage', `${primaryStats.brakeUsage.toFixed(1)}%`), line('DRS Usage', `${primaryStats.drsUsage.toFixed(1)}%`)] : ['Unavailable'], format))
  lines.push(...section('Sector Analysis', [line('Sector 1', primarySectors[0]), line('Sector 2', primarySectors[1]), line('Sector 3', primarySectors[2]), line('Total Lap', state.primaryLap?.lapTime)], format))
  lines.push(...section('Corner Analysis', cornerMetrics && state.selectedCorner ? [line('Selected Corner', `${state.selectedCorner.cornerNumber}${state.selectedCorner.cornerLetter ?? ''}`), line('Entry Speed', `${cornerMetrics.entrySpeed.toFixed(1)} km/h`), line('Apex Speed', `${cornerMetrics.apexSpeed.toFixed(1)} km/h`), line('Exit Speed', `${cornerMetrics.exitSpeed.toFixed(1)} km/h`), line('Minimum Gear', cornerMetrics.minimumGear), line('Brake Duration', `${cornerMetrics.brakeDuration.toFixed(3)} s`), line('Throttle Exit', `${cornerMetrics.throttleAtExit.toFixed(1)}%`)] : ['Unavailable'], format))
  lines.push(...section('Engineering Insights', state.insights.length ? state.insights.map((insight) => `${insight.title}: ${insight.explanation}`) : ['Unavailable'], format))
  if (state.comparisonEnabled) {
    const sectorDeltas = primarySectors.map((sector, index) => {
      const primary = parseLapTime(sector)
      const secondary = parseLapTime(secondarySectors[index])
      return primary === null || secondary === null ? 'Unavailable' : `${(primary - secondary).toFixed(3)} s`
    })
    const delta = lapDelta !== null && secondaryLapTime !== null ? `${(lapDelta - secondaryLapTime).toFixed(3)} s` : 'Unavailable'
    const brake = brakePrimary !== null && brakeSecondary !== null ? `${(brakeSecondary - brakePrimary).toFixed(1)} m (positive: primary later)` : 'Unavailable'
    lines.push(...section('Comparison Summary', [line('Primary Driver', state.primaryDriver?.fullName ?? state.primarySelection.driver), line('Secondary Driver', state.secondaryDriver?.fullName ?? state.secondarySelection.driver), line('Lap Delta', delta), line('Sector 1 Delta', sectorDeltas[0]), line('Sector 2 Delta', sectorDeltas[1]), line('Sector 3 Delta', sectorDeltas[2]), line('Brake Comparison', brake)], format))
  }
  lines.push('Generated by RaceCraft', '='.repeat(40))
  return lines.join('\n')
}

export function downloadSessionReport(state: SessionReportState, format: ReportFormat): void {
  const content = createSessionReport(state, format)
  const extension = format === 'markdown' ? 'md' : 'txt'
  const driver = (state.primaryDriver?.abbreviation ?? state.primarySelection.driver ?? 'Session').replace(/[^a-z0-9_-]/gi, '_')
  const lap = state.primaryLap?.lapNumber ?? 'Lap'
  const blob = new Blob([content], { type: format === 'markdown' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `RaceCraft_Report_${driver}_${lap}.${extension}`
  link.click()
  URL.revokeObjectURL(url)
}
