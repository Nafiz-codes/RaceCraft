import { getApiData } from '@/services/api/client'
import type { CornersPayload } from '@/types/corner'

interface CornersRequest {
  season: number
  event: string
  session: string
}

export function getCorners(
  { season, event, session }: CornersRequest,
  signal?: AbortSignal,
): Promise<CornersPayload> {
  return getApiData<CornersPayload>(
    `/seasons/${season}/events/${encodeURIComponent(event)}/sessions/${encodeURIComponent(session)}/corners`,
    { signal },
  )
}
