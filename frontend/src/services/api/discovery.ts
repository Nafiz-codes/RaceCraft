import { getApiData } from "@/services/api/client"
import type {
  DriversPayload,
  EventsPayload,
  LapsPayload,
  SeasonsPayload,
  SessionsPayload,
} from "@/types/discovery"

export function getSeasons(signal?: AbortSignal): Promise<SeasonsPayload> {
  return getApiData<SeasonsPayload>("/seasons", { signal })
}

export function getEvents(season: number, signal?: AbortSignal): Promise<EventsPayload> {
  return getApiData<EventsPayload>(`/seasons/${season}/events`, { signal })
}

export function getSessions(
  season: number,
  event: string,
  signal?: AbortSignal,
): Promise<SessionsPayload> {
  return getApiData<SessionsPayload>(
    `/seasons/${season}/events/${encodeURIComponent(event)}/sessions`,
    { signal },
  )
}

export function getDrivers(
  season: number,
  event: string,
  session: string,
  signal?: AbortSignal,
): Promise<DriversPayload> {
  return getApiData<DriversPayload>(
    `/seasons/${season}/events/${encodeURIComponent(event)}/sessions/${encodeURIComponent(session)}/drivers`,
    { signal },
  )
}

export function getLaps(
  season: number,
  event: string,
  session: string,
  driver: string,
  signal?: AbortSignal,
): Promise<LapsPayload> {
  return getApiData<LapsPayload>(
    `/seasons/${season}/events/${encodeURIComponent(event)}/sessions/${encodeURIComponent(session)}/drivers/${encodeURIComponent(driver)}/laps`,
    { signal },
  )
}
