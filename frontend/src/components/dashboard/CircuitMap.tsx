import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'

import type { CircuitPointModel } from '@/types/circuit'
import type { TelemetryModel } from '@/types/telemetry'

interface CircuitMapProps {
  points: CircuitPointModel[]
  telemetry: TelemetryModel[] | undefined
  selectedTelemetryIndex: number
}

const MAP_HEIGHT = 360
const PADDING = 28

function getExtent(values: number[]): [number, number] {
  const [minimum, maximum] = d3.extent(values)
  return minimum === undefined || maximum === undefined ? [0, 1] : [minimum, maximum]
}

export default function CircuitMap({ points, telemetry, selectedTelemetryIndex }: CircuitMapProps) {
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
  const availableWidth = Math.max(width - PADDING * 2, 0)
  const availableHeight = MAP_HEIGHT - PADDING * 2
  const scale = Math.min(availableWidth / sourceWidth, availableHeight / sourceHeight)
  const renderedWidth = sourceWidth * scale
  const renderedHeight = sourceHeight * scale
  const offsetX = (width - renderedWidth) / 2
  const offsetY = (MAP_HEIGHT - renderedHeight) / 2
  const xScale = d3.scaleLinear().domain([minimumX, maximumX]).range([offsetX, offsetX + renderedWidth]).clamp(true)
  const yScale = d3.scaleLinear().domain([minimumY, maximumY]).range([offsetY + renderedHeight, offsetY]).clamp(true)
  const path = d3
    .line<CircuitPointModel>()
    .x((point) => xScale(point.x))
    .y((point) => yScale(point.y))
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
    <div ref={containerRef} className="h-[360px] w-full" aria-label="Circuit map">
      {width > PADDING * 2 && points.length > 0 && (
        <svg viewBox={`0 0 ${width} ${MAP_HEIGHT}`} role="img" aria-label="Formula 1 circuit outline" className="h-full w-full">
          <g>
            {d3.range(PADDING, width, 48).map((position) => <line key={`vertical-${position}`} x1={position} x2={position} y1={0} y2={MAP_HEIGHT} stroke="var(--color-border)" strokeDasharray="2 6" />)}
            {d3.range(PADDING, MAP_HEIGHT, 48).map((position) => <line key={`horizontal-${position}`} x1={0} x2={width} y1={position} y2={position} stroke="var(--color-border)" strokeDasharray="2 6" />)}
          </g>
          <path d={path(points) ?? undefined} fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {selectedSample && (
            <path
              d="M 6 0 L -4 -4 L -4 4 Z"
              transform={`translate(${xScale(selectedSample.x)},${yScale(selectedSample.y)}) rotate(${headingAngle})`}
              fill="var(--color-primary-purple)"
              stroke="var(--color-background)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      )}
    </div>
  )
}
