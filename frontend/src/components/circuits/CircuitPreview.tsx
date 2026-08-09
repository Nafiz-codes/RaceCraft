import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { getCircuit } from '@/services/api/circuit'
import type { CircuitPointModel } from '@/types/circuit'

interface CircuitPreviewProps {
  circuitName: string
}

interface GeometryState {
  points: CircuitPointModel[]
  status: 'idle' | 'loading' | 'ready' | 'unavailable'
}

const geometryCache = new Map<string, CircuitPointModel[]>()
const geometryUnavailable = new Set<string>()
const GEOMETRY_SEASON = 2024

function geometryKey(circuitName: string): string {
  return `${GEOMETRY_SEASON}:${circuitName}`
}

function CircuitPath({ points }: { points: CircuitPointModel[] }): ReactNode {
  const { path, viewBox } = useMemo(() => {
    const minX = Math.min(...points.map((point) => point.x))
    const maxX = Math.max(...points.map((point) => point.x))
    const minY = Math.min(...points.map((point) => point.y))
    const maxY = Math.max(...points.map((point) => point.y))
    const width = maxX - minX || 1
    const height = maxY - minY || 1
    const padding = Math.max(width, height) * 0.08

    return {
      path: points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' '),
      viewBox: `${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}`,
    }
  }, [points])

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Official circuit geometry" className="h-full w-full max-w-sm">
      <path d={path} fill="none" stroke="var(--color-border-hover)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" vectorEffect="non-scaling-stroke" />
      <path d={path} fill="none" stroke="var(--color-text-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx={points[0].x} cy={points[0].y} r="3" fill="var(--color-f1-red)" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** Renders FastF1 circuit geometry through RaceCraft's existing circuit API. */
export default function CircuitPreview({ circuitName }: CircuitPreviewProps): ReactNode {
  const [state, setState] = useState<GeometryState>({ points: [], status: 'idle' })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const key = geometryKey(circuitName)
    const cachedPoints = geometryCache.get(key)
    if (cachedPoints) {
      setState({ points: cachedPoints, status: 'ready' })
      return undefined
    }
    if (geometryUnavailable.has(key)) {
      setState({ points: [], status: 'unavailable' })
      return undefined
    }

    const controller = new AbortController()
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      observer.disconnect()
      setState({ points: [], status: 'loading' })
      getCircuit({ season: GEOMETRY_SEASON, event: circuitName, session: 'Race' }, controller.signal)
        .then(({ points }) => {
          if (controller.signal.aborted) return
          if (points.length < 2) {
            geometryUnavailable.add(key)
            setState({ points: [], status: 'unavailable' })
            return
          }
          geometryCache.set(key, points)
          setState({ points, status: 'ready' })
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            geometryUnavailable.add(key)
            setState({ points: [], status: 'unavailable' })
          }
        })
    }, { rootMargin: '240px' })

    observer.observe(container)
    return () => {
      controller.abort()
      observer.disconnect()
    }
  }, [circuitName])

  return (
    <div ref={containerRef} className="grid h-full w-full place-items-center" aria-live="polite">
      {state.status === 'ready' && <CircuitPath points={state.points} />}
      {state.status === 'loading' && <span className="rc-type-caption text-[var(--color-text-muted)]">Loading circuit geometry</span>}
      {(state.status === 'idle' || state.status === 'unavailable') && <span className="rc-type-caption text-center text-[var(--color-text-muted)]">Circuit geometry unavailable</span>}
    </div>
  )
}
