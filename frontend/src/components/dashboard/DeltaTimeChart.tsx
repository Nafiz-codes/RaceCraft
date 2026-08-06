import * as d3 from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { TelemetryModel } from '@/types/telemetry'

interface DeltaTimeChartProps {
  primaryTelemetry: TelemetryModel[]
  secondaryTelemetry: TelemetryModel[]
}

interface DeltaPoint {
  distance: number
  deltaTime: number
}

const CHART_HEIGHT = 180
const MARGIN = { top: 18, right: 20, bottom: 38, left: 56 }
const distanceBisector = d3.bisector<TelemetryModel, number>((sample) => sample.distance).left
const timePattern = /(?:(\d+) days )?(\d+):(\d+):(\d+(?:\.\d+)?)/

function parseElapsedSeconds(time: string): number | null {
  const match = time.match(timePattern)
  if (!match) {
    return null
  }

  const [, days = '0', hours, minutes, seconds] = match
  return Number(days) * 86_400 + Number(hours) * 3_600 + Number(minutes) * 60 + Number(seconds)
}

function getDomain(values: number[]): [number, number] {
  const [minimum, maximum] = d3.extent(values)
  if (minimum === undefined || maximum === undefined) {
    return [0, 1]
  }

  return minimum === maximum ? [minimum - 1, maximum + 1] : [minimum, maximum]
}

function getNearestSecondarySample(
  telemetry: TelemetryModel[],
  distance: number,
): TelemetryModel {
  const nextIndex = distanceBisector(telemetry, distance)
  if (nextIndex === 0) {
    return telemetry[0]
  }
  if (nextIndex === telemetry.length) {
    return telemetry[telemetry.length - 1]
  }

  const previousSample = telemetry[nextIndex - 1]
  const nextSample = telemetry[nextIndex]
  return distance - previousSample.distance <= nextSample.distance - distance
    ? previousSample
    : nextSample
}

export default function DeltaTimeChart({ primaryTelemetry, secondaryTelemetry }: DeltaTimeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const deltaPoints = useMemo<DeltaPoint[]>(
    () =>
      primaryTelemetry.flatMap((primarySample) => {
        const secondarySample = getNearestSecondarySample(secondaryTelemetry, primarySample.distance)
        const primaryTime = parseElapsedSeconds(primarySample.time)
        const secondaryTime = parseElapsedSeconds(secondarySample.time)

        if (primaryTime === null || secondaryTime === null) {
          return []
        }

        return [{ distance: primarySample.distance, deltaTime: primaryTime - secondaryTime }]
      }),
    [primaryTelemetry, secondaryTelemetry],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return undefined
    }

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 0)
  const plotHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom
  const xValues = [
    ...primaryTelemetry.map((sample) => sample.distance),
    ...secondaryTelemetry.map((sample) => sample.distance),
  ]
  const maxAbsoluteDelta = Math.max(...deltaPoints.map((point) => Math.abs(point.deltaTime)), 0)
  const yExtent = maxAbsoluteDelta || 1
  const xScale = d3.scaleLinear().domain(getDomain(xValues)).range([0, plotWidth])
  const yScale = d3.scaleLinear().domain([-yExtent, yExtent]).range([plotHeight, 0])
  const line = d3
    .line<DeltaPoint>()
    .x((point) => xScale(point.distance))
    .y((point) => yScale(point.deltaTime))

  return (
    <section className="mt-[var(--space-lg)] border-t border-[var(--color-border)] pt-[var(--space-lg)]" aria-labelledby="delta-time-title">
      <div className="flex items-baseline justify-between gap-[var(--space-md)]">
        <h3 id="delta-time-title" className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">Delta Time</h3>
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">+ Primary Slower</p>
      </div>
      <div ref={containerRef} className="mt-[var(--space-sm)] h-[180px] w-full">
        {width > MARGIN.left + MARGIN.right && deltaPoints.length > 0 && (
          <svg viewBox={`0 0 ${width} ${CHART_HEIGHT}`} role="img" aria-label="Delta time by distance" className="h-full w-full">
            <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
              {xScale.ticks(6).map((tick) => <line key={`x-grid-${tick}`} x1={xScale(tick)} x2={xScale(tick)} y1={0} y2={plotHeight} stroke="var(--color-border)" strokeDasharray="2 4" />)}
              {yScale.ticks(5).map((tick) => <line key={`y-grid-${tick}`} x1={0} x2={plotWidth} y1={yScale(tick)} y2={yScale(tick)} stroke="var(--color-border)" strokeDasharray="2 4" />)}
              <line x1={0} x2={plotWidth} y1={yScale(0)} y2={yScale(0)} stroke="var(--color-border-hover)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path d={line(deltaPoints) ?? undefined} fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              {xScale.ticks(6).map((tick) => <text key={`x-label-${tick}`} x={xScale(tick)} y={plotHeight + 18} textAnchor="middle" fill="var(--color-text-muted)" className="[font-family:var(--font-family-mono)] text-[10px]">{tick}</text>)}
              {yScale.ticks(5).map((tick) => <text key={`y-label-${tick}`} x={-10} y={yScale(tick) + 3} textAnchor="end" fill="var(--color-text-muted)" className="[font-family:var(--font-family-mono)] text-[10px]">{tick.toFixed(2)}</text>)}
              <text x={plotWidth / 2} y={plotHeight + 32} textAnchor="middle" fill="var(--color-text-muted)" className="[font-family:var(--font-family-mono)] text-[10px] uppercase tracking-[0.1em]">Distance</text>
              <text transform={`translate(${-42},${plotHeight / 2}) rotate(-90)`} textAnchor="middle" fill="var(--color-text-muted)" className="[font-family:var(--font-family-mono)] text-[10px] uppercase tracking-[0.1em]">Delta Seconds</text>
            </g>
          </svg>
        )}
      </div>
    </section>
  )
}
