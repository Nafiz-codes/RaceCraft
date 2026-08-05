import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'

import type { TelemetryModel } from '@/types/telemetry'

export type TelemetryChannel = 'speed' | 'throttle' | 'brake' | 'rpm' | 'gear' | 'drs'

interface TelemetryChartProps {
  telemetry: TelemetryModel[]
  channel: TelemetryChannel
}

const CHART_HEIGHT = 280
const MARGIN = { top: 20, right: 20, bottom: 42, left: 56 }

const CHANNEL_LABELS: Record<TelemetryChannel, string> = {
  speed: 'Speed',
  throttle: 'Throttle',
  brake: 'Brake',
  rpm: 'RPM',
  gear: 'Gear',
  drs: 'DRS',
}

function getChannelValue(sample: TelemetryModel, channel: TelemetryChannel): number {
  if (channel === 'brake') {
    return sample.brake ? 1 : 0
  }

  return sample[channel]
}

function getDomain(values: number[]): [number, number] {
  const [minimum, maximum] = d3.extent(values)
  if (minimum === undefined || maximum === undefined) {
    return [0, 1]
  }

  return minimum === maximum ? [minimum - 1, maximum + 1] : [minimum, maximum]
}

export default function TelemetryChart({ telemetry, channel }: TelemetryChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

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
  const xScale = d3.scaleLinear().domain(getDomain(telemetry.map((sample) => sample.distance))).range([0, plotWidth])
  const yScale = d3.scaleLinear().domain(getDomain(telemetry.map((sample) => getChannelValue(sample, channel)))).range([plotHeight, 0])
  const line = d3
    .line<TelemetryModel>()
    .x((sample) => xScale(sample.distance))
    .y((sample) => yScale(getChannelValue(sample, channel)))
  const canRenderChart = width > MARGIN.left + MARGIN.right && telemetry.length > 0

  return (
    <div ref={containerRef} className="h-[280px] w-full" aria-label={`${CHANNEL_LABELS[channel]} by distance`}>
      {canRenderChart && (
        <svg viewBox={`0 0 ${width} ${CHART_HEIGHT}`} role="img" aria-label={`${CHANNEL_LABELS[channel]} plotted against distance`} className="h-full w-full">
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {xScale.ticks(6).map((tick) => <line key={`x-grid-${tick}`} x1={xScale(tick)} x2={xScale(tick)} y1={0} y2={plotHeight} stroke="var(--color-border)" strokeDasharray="2 4" />)}
            {yScale.ticks(5).map((tick) => <line key={`y-grid-${tick}`} x1={0} x2={plotWidth} y1={yScale(tick)} y2={yScale(tick)} stroke="var(--color-border)" strokeDasharray="2 4" />)}
            <line x1={0} x2={plotWidth} y1={plotHeight} y2={plotHeight} stroke="var(--color-border-hover)" />
            <line x1={0} x2={0} y1={0} y2={plotHeight} stroke="var(--color-border-hover)" />
            <path d={line(telemetry) ?? undefined} fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {xScale.ticks(6).map((tick) => <text key={`x-label-${tick}`} x={xScale(tick)} y={plotHeight + 20} textAnchor="middle" fill="var(--color-text-muted)" className="[font-family:var(--font-family-mono)] text-[10px]">{tick}</text>)}
            {yScale.ticks(5).map((tick) => <text key={`y-label-${tick}`} x={-10} y={yScale(tick) + 3} textAnchor="end" fill="var(--color-text-muted)" className="[font-family:var(--font-family-mono)] text-[10px]">{tick}</text>)}
            <text x={plotWidth / 2} y={plotHeight + 36} textAnchor="middle" fill="var(--color-text-muted)" className="[font-family:var(--font-family-mono)] text-[10px] uppercase tracking-[0.1em]">Distance</text>
            <text transform={`translate(${-42},${plotHeight / 2}) rotate(-90)`} textAnchor="middle" fill="var(--color-text-muted)" className="[font-family:var(--font-family-mono)] text-[10px] uppercase tracking-[0.1em]">{CHANNEL_LABELS[channel]}</text>
          </g>
        </svg>
      )}
    </div>
  )
}
