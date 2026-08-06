import { getApiData } from '@/services/api/client'
import type { CircuitInformationPayload } from '@/types/circuitInformation'

interface CircuitInformationRequest {
  season: number
  event: string
  session: string
}

export function getCircuitInformation(
  { season, event, session }: CircuitInformationRequest,
  signal?: AbortSignal,
): Promise<CircuitInformationPayload> {
  return getApiData<CircuitInformationPayload>(
    `/seasons/${season}/events/${encodeURIComponent(event)}/sessions/${encodeURIComponent(session)}/circuit-information`,
    { signal },
  )
}
