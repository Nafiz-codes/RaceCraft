import { getApiData } from '@/services/api/client'
import type { CircuitPayload } from '@/types/circuit'

interface CircuitRequest {
  season: number
  event: string
  session: string
}

export function getCircuit(
  { season, event, session }: CircuitRequest,
  signal?: AbortSignal,
): Promise<CircuitPayload> {
  return getApiData<CircuitPayload>(
    `/seasons/${season}/events/${encodeURIComponent(event)}/sessions/${encodeURIComponent(session)}/circuit`,
    { signal },
  )
}
