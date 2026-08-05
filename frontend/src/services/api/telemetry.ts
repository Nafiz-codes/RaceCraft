import { getApiData } from '@/services/api/client'
import type { TelemetryPayload } from '@/types/telemetry'

interface TelemetryRequest {
  season: number
  event: string
  session: string
  driver: string
  lap: number
}

export function getTelemetry(
  { season, event, session, driver, lap }: TelemetryRequest,
  signal?: AbortSignal,
): Promise<TelemetryPayload> {
  return getApiData<TelemetryPayload>(
    `/seasons/${season}/events/${encodeURIComponent(event)}/sessions/${encodeURIComponent(session)}/drivers/${encodeURIComponent(driver)}/laps/${lap}/telemetry`,
    { signal },
  )
}
