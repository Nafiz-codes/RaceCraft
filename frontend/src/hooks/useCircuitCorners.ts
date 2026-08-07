import { useEffect, useState } from 'react'

import { getCorners } from '@/services/api/corners'
import type { CornersPayload } from '@/types/corner'

interface CircuitCornerSelection {
  season: number | null
  event: string | null
  session: string | null
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'The RaceCraft API request failed.'
}

function isAbortedRequest(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

export default function useCircuitCorners(selection: CircuitCornerSelection) {
  const { event, season, session } = selection
  const [data, setData] = useState<CornersPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (season === null || event === null || session === null) {
      setData(null)
      setError(null)
      setIsLoading(false)
      return undefined
    }

    const controller = new AbortController()
    setData(null)
    setError(null)
    setIsLoading(true)

    getCorners({ season, event, session }, controller.signal)
      .then((payload) => {
        if (!controller.signal.aborted) {
          setData(payload)
        }
      })
      .catch((requestError: unknown) => {
        if (!isAbortedRequest(requestError)) {
          setError(getErrorMessage(requestError))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [event, season, session])

  return { data, error, isLoading }
}
