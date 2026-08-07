import { useMemo, type ReactNode } from 'react'

import type { Lap } from '@/types/discovery'

interface SectorAnalysisPanelProps {
  comparisonEnabled: boolean
  primaryLap: Lap | undefined
  secondaryLap: Lap | undefined
}

interface SectorDefinition {
  key: 'sector1Time' | 'sector2Time' | 'sector3Time'
  label: string
}

const SECTORS: SectorDefinition[] = [
  { key: 'sector1Time', label: 'S1' },
  { key: 'sector2Time', label: 'S2' },
  { key: 'sector3Time', label: 'S3' },
]

function parseLapTime(value: string | null | undefined): number | null {
  if (!value) return null
  const [minutes, seconds] = value.split(':')
  const minuteValue = Number(minutes)
  const secondValue = Number(seconds)
  return Number.isFinite(minuteValue) && Number.isFinite(secondValue)
    ? minuteValue * 60 + secondValue
    : null
}

function formatDelta(delta: number | null): string {
  return delta === null ? '—' : `${delta > 0 ? '+' : ''}${delta.toFixed(3)}s`
}

function SectorRow({
  label,
  primaryTime,
  secondaryTime,
  delta,
  comparisonEnabled,
}: {
  label: string
  primaryTime: string | null
  secondaryTime: string | null
  delta: number | null
  comparisonEnabled: boolean
}): ReactNode {
  const primaryIsFaster = delta !== null && delta < 0
  const secondaryIsFaster = delta !== null && delta > 0
  const columnLayout = comparisonEnabled
    ? 'grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_minmax(4.5rem,auto)]'
    : 'grid-cols-[3rem_minmax(0,1fr)]'

  return (
    <div className={`grid items-center gap-x-[var(--space-sm)] gap-y-1 border border-[var(--color-border)] p-[var(--space-md)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] transition-[background-color,border-color] duration-[var(--duration-fast)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface)] ${columnLayout}`}>
      <span className="whitespace-nowrap uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{label}</span>
      <span className={`min-w-0 truncate whitespace-nowrap ${primaryIsFaster ? 'text-[var(--color-success)]' : 'text-[var(--color-text-primary)]'}`}>
        {primaryTime ?? '—'}
      </span>
      {comparisonEnabled && (
        <span className={`min-w-0 truncate whitespace-nowrap ${secondaryIsFaster ? 'text-[var(--color-success)]' : 'text-[var(--color-text-primary)]'}`}>
          {secondaryTime ?? '—'}
        </span>
      )}
      {comparisonEnabled && <span className="whitespace-nowrap text-right text-[var(--color-text-muted)]">Δ {formatDelta(delta)}</span>}
    </div>
  )
}

export default function SectorAnalysisPanel({ comparisonEnabled, primaryLap, secondaryLap }: SectorAnalysisPanelProps): ReactNode {
  const showComparison = comparisonEnabled && Boolean(secondaryLap)
  const headerColumns = showComparison
    ? 'grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_minmax(4.5rem,auto)]'
    : 'grid-cols-[3rem_minmax(0,1fr)]'
  const analysis = useMemo(() => {
    if (!primaryLap) return null
    const secondaryAvailable = comparisonEnabled && Boolean(secondaryLap)
    const sectors = SECTORS.map(({ key, label }) => {
      const primaryTime = primaryLap[key]
      const secondaryTime = secondaryAvailable ? secondaryLap?.[key] ?? null : null
      const primarySeconds = parseLapTime(primaryTime)
      const secondarySeconds = parseLapTime(secondaryTime)
      return {
        label,
        primaryTime,
        secondaryTime,
        delta: secondaryAvailable && primarySeconds !== null && secondarySeconds !== null ? primarySeconds - secondarySeconds : null,
      }
    })
    const primaryLapSeconds = parseLapTime(primaryLap.lapTime)
    const secondaryLapSeconds = parseLapTime(secondaryLap?.lapTime)
    return {
      sectors,
      primaryLapTime: primaryLap.lapTime,
      secondaryLapTime: secondaryAvailable ? secondaryLap?.lapTime ?? null : null,
      lapDelta: secondaryAvailable && primaryLapSeconds !== null && secondaryLapSeconds !== null ? primaryLapSeconds - secondaryLapSeconds : null,
    }
  }, [comparisonEnabled, primaryLap, secondaryLap])

  return (
    <section id="sector-analysis" aria-labelledby="sector-analysis-title" className="flex min-h-48 flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-4">
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">System 4E</p>
        <h2 id="sector-analysis-title" className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]">Sector Analysis</h2>
      </div>
      {analysis ? (
        <div className="mt-[var(--space-lg)] min-w-0 border-t border-[var(--color-border)] pt-[var(--space-md)]">
          <div className={`mb-[var(--space-sm)] grid gap-x-[var(--space-sm)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-muted)] ${headerColumns}`}>
            <span className="whitespace-nowrap">Sector</span>
            <span className="min-w-0 truncate whitespace-nowrap">Primary</span>
            {showComparison && <span className="min-w-0 truncate whitespace-nowrap">Secondary</span>}
            {showComparison && <span className="whitespace-nowrap text-right">Delta</span>}
          </div>
          <div className="grid gap-1">
            {analysis.sectors.map((sector) => <SectorRow key={sector.label} {...sector} comparisonEnabled={showComparison} />)}
          </div>
          <div className="mt-[var(--space-md)] grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[var(--space-md)] gap-y-1 border-t border-[var(--color-border)] pt-[var(--space-md)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)]">
            <span className="min-w-0 truncate uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Total Lap Time</span>
            <span className="whitespace-nowrap text-right text-[var(--color-text-primary)]">{analysis.primaryLapTime ?? '—'}{showComparison && ` / ${analysis.secondaryLapTime ?? '—'}`}</span>
            {showComparison && <span className="col-span-2 whitespace-nowrap text-right text-[var(--color-text-muted)]">Δ {formatDelta(analysis.lapDelta)}</span>}
          </div>
        </div>
      ) : (
        <div className="rc-empty-state mt-[var(--space-lg)]"><p className="text-[var(--font-size-small)] leading-[var(--line-height-small)]">No Lap Selected<br /><span className="text-[var(--font-size-caption)] text-[var(--color-text-muted)]">Select a primary lap to load official sector timing.</span></p></div>
      )}
    </section>
  )
}
