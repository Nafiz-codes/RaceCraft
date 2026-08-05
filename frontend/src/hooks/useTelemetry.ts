import { useEffect, useState } from 'react'

import { getTelemetry } from '@/services/api/telemetry'
import type { TelemetryPayload } from '@/types/telemetry'

export interface TelemetrySelection {
  season: number | null
  event: string | null
  session: string | null
  driver: string | null
  lap: number | null
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'The RaceCraft API request failed.'
}

function isAbortedRequest(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

export default function useTelemetry(selection: TelemetrySelection) {
  const { driver, event, lap, season, session } = selection
  const [data, setData] = useState<TelemetryPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (
      season === null ||
      event === null ||
      session === null ||
      driver === null ||
      lap === null
    ) {
      setData(null)
      setError(null)
      setIsLoading(false)
      return undefined
    }

    const controller = new AbortController()
    setData(null)
    setError(null)
    setIsLoading(true)

    getTelemetry({ season, event, session, driver, lap }, controller.signal)
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
  }, [driver, event, lap, season, session])

  return { data, error, isLoading }
}
