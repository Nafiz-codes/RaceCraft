import * as d3 from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { CircuitPointModel } from '@/types/circuit'
import type { CircuitCorner } from '@/types/corner'
import type { TelemetryModel } from '@/types/telemetry'

interface CircuitMapProps {
  points: CircuitPointModel[]
  corners: CircuitCorner[] | undefined
  telemetry: TelemetryModel[] | undefined
  selectedTelemetryIndex: number
  selectedCornerNumber: number | null
  compact?: boolean
}

const MAP_HEIGHT = 360
const PADDING = 28

function getExtent(values: number[]): [number, number] {
  const [minimum, maximum] = d3.extent(values)
  return minimum === undefined || maximum === undefined ? [0, 1] : [minimum, maximum]
}

export default function CircuitMap({
  points,
  corners,
  telemetry,
  selectedTelemetryIndex,
  selectedCornerNumber,
  compact = false,
}: CircuitMapProps) {
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

  const [minimumX, maximumX] = getExtent(points.map((point) => point.x))
  const [minimumY, maximumY] = getExtent(points.map((point) => point.y))
  const sourceWidth = maximumX - minimumX || 1
  const sourceHeight = maximumY - minimumY || 1
  const mapHeight = compact ? 240 : MAP_HEIGHT
  const padding = compact ? 18 : PADDING
  const availableWidth = Math.max(width - padding * 2, 0)
  const availableHeight = mapHeight - padding * 2
  const scale = Math.min(availableWidth / sourceWidth, availableHeight / sourceHeight)
  const renderedWidth = sourceWidth * scale
  const renderedHeight = sourceHeight * scale
  const offsetX = (width - renderedWidth) / 2
  const offsetY = (mapHeight - renderedHeight) / 2
  const xScale = d3.scaleLinear().domain([minimumX, maximumX]).range([offsetX, offsetX + renderedWidth]).clamp(true)
  const yScale = d3.scaleLinear().domain([minimumY, maximumY]).range([offsetY + renderedHeight, offsetY]).clamp(true)
  const path = d3
    .line<CircuitPointModel>()
    .x((point) => xScale(point.x))
    .y((point) => yScale(point.y))
  const brakeSegments = useMemo(() => {
    if (!telemetry) {
      return []
    }

    const segments: TelemetryModel[][] = []
    let activeSegment: TelemetryModel[] = []

    for (const sample of telemetry) {
      if (sample.brake) {
        activeSegment.push(sample)
        continue
      }

      if (activeSegment.length > 1) {
        segments.push(activeSegment)
      }
      activeSegment = []
    }

    if (activeSegment.length > 1) {
      segments.push(activeSegment)
    }

    return segments
  }, [telemetry])
  const brakePath = d3
    .line<TelemetryModel>()
    .x((sample) => xScale(sample.x))
    .y((sample) => yScale(sample.y))
  const selectedSample = telemetry?.[selectedTelemetryIndex]
  const followingSample = telemetry?.[selectedTelemetryIndex + 1]
  const precedingSample = telemetry?.[selectedTelemetryIndex - 1]
  const headingStart = followingSample ? selectedSample : precedingSample
  const headingEnd = followingSample ?? selectedSample
  const headingAngle =
    headingStart && headingEnd
      ? (Math.atan2(
          yScale(headingEnd.y) - yScale(headingStart.y),
          xScale(headingEnd.x) - xScale(headingStart.x),
        ) *
          180) /
        Math.PI
      : 0

  return (
    <div ref={containerRef} className={compact ? 'h-[240px] w-full overflow-hidden' : 'h-[360px] w-full overflow-hidden'} aria-label="Circuit map">
      {width > padding * 2 && points.length > 0 && (
        <svg viewBox={`0 0 ${width} ${mapHeight}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Formula 1 circuit outline" className="block h-full w-full">
          <g>
            {d3.range(padding, width, 48).map((position) => <line key={`vertical-${position}`} x1={position} x2={position} y1={0} y2={mapHeight} stroke="var(--color-border)" strokeDasharray="2 6" />)}
            {d3.range(padding, mapHeight, 48).map((position) => <line key={`horizontal-${position}`} x1={0} x2={width} y1={position} y2={position} stroke="var(--color-border)" strokeDasharray="2 6" />)}
          </g>
          <path d={path(points) ?? undefined} fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {brakeSegments.map((segment, index) => (
            <path
              key={`brake-segment-${index}`}
              d={brakePath(segment) ?? undefined}
              fill="none"
              stroke="var(--color-warning)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {!compact && corners?.map((corner) => {
            const isSelected = corner.cornerNumber === selectedCornerNumber
            return (
              <g key={corner.cornerNumber} transform={`translate(${xScale(corner.x)},${yScale(corner.y)})`}>
                <circle r="7" fill={isSelected ? 'var(--color-primary-purple)' : 'var(--color-background-secondary)'} stroke={isSelected ? 'var(--color-primary-purple)' : 'var(--color-border-hover)'} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <text y="3" textAnchor="middle" fill={isSelected ? 'var(--color-background)' : 'var(--color-text-primary)'} className="[font-family:var(--font-family-mono)] text-[8px]">{corner.cornerNumber}</text>
              </g>
            )
          })}
          {selectedSample && (
            <g transform={`translate(${xScale(selectedSample.x)},${yScale(selectedSample.y)}) rotate(${headingAngle})`}>
              <circle r="12" fill="var(--color-primary-purple)" opacity="0.3" className="rc-live-marker-pulse" />
              <path d="M 6 0 L -4 -4 L -4 4 Z" fill="var(--color-primary-purple)" stroke="var(--color-background)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </g>
          )}
        </svg>
      )}
    </div>
  )
}
