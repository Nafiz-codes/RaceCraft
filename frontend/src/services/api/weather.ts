import { getApiData } from '@/services/api/client'
import type { WeatherPayload } from '@/types/weather'

interface WeatherRequest {
  season: number
  event: string
  session: string
}

export function getWeather(
  { season, event, session }: WeatherRequest,
  signal?: AbortSignal,
): Promise<WeatherPayload> {
  return getApiData<WeatherPayload>(
    `/seasons/${season}/events/${encodeURIComponent(event)}/sessions/${encodeURIComponent(session)}/weather`,
    { signal },
  )
}
