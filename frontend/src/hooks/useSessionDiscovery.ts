import { useCallback, useEffect, useState } from "react"

import { getDrivers, getEvents, getLaps, getSeasons, getSessions } from "@/services/api/discovery"
import type { Driver, Event, Lap, Season, Session } from "@/types/discovery"

interface DiscoverySelection {
  season: number | null
  event: string | null
  session: string | null
  driver: string | null
  lap: number | null
}

interface DiscoveryLoading {
  drivers: boolean
  events: boolean
  seasons: boolean
  sessions: boolean
  laps: boolean
}

interface DiscoveryErrors {
  drivers: string | null
  events: string | null
  seasons: string | null
  sessions: string | null
  laps: string | null
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The RaceCraft API request failed."
}

function isAbortedRequest(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError"
}

export default function useSessionDiscovery() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [laps, setLaps] = useState<Lap[]>([])
  const [selection, setSelection] = useState<DiscoverySelection>({
    season: null,
    event: null,
    session: null,
    driver: null,
    lap: null,
  })
  const [loading, setLoading] = useState<DiscoveryLoading>({
    seasons: false,
    events: false,
    sessions: false,
    drivers: false,
    laps: false,
  })
  const [errors, setErrors] = useState<DiscoveryErrors>({
    seasons: null,
    events: null,
    sessions: null,
    drivers: null,
    laps: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    setLoading((current) => ({ ...current, seasons: true }))
    setErrors((current) => ({ ...current, seasons: null }))

    getSeasons(controller.signal)
      .then((payload) => {
        if (!controller.signal.aborted) {
          setSeasons(payload.seasons)
        }
      })
      .catch((error: unknown) => {
        if (!isAbortedRequest(error)) {
          setErrors((current) => ({ ...current, seasons: getErrorMessage(error) }))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading((current) => ({ ...current, seasons: false }))
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (selection.season === null) {
      setEvents([])
      return undefined
    }

    const controller = new AbortController()
    setLoading((current) => ({ ...current, events: true }))
    setErrors((current) => ({ ...current, events: null }))

    getEvents(selection.season, controller.signal)
      .then((payload) => {
        if (!controller.signal.aborted) {
          setEvents(payload.events)
        }
      })
      .catch((error: unknown) => {
        if (!isAbortedRequest(error)) {
          setErrors((current) => ({ ...current, events: getErrorMessage(error) }))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading((current) => ({ ...current, events: false }))
        }
      })

    return () => controller.abort()
  }, [selection.season])

  useEffect(() => {
    if (selection.season === null || selection.event === null) {
      setSessions([])
      return undefined
    }

    const controller = new AbortController()
    setLoading((current) => ({ ...current, sessions: true }))
    setErrors((current) => ({ ...current, sessions: null }))

    getSessions(selection.season, selection.event, controller.signal)
      .then((payload) => {
        if (!controller.signal.aborted) {
          setSessions(payload.sessions)
        }
      })
      .catch((error: unknown) => {
        if (!isAbortedRequest(error)) {
          setErrors((current) => ({ ...current, sessions: getErrorMessage(error) }))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading((current) => ({ ...current, sessions: false }))
        }
      })

    return () => controller.abort()
  }, [selection.event, selection.season])

  useEffect(() => {
    if (selection.season === null || selection.event === null || selection.session === null) {
      setDrivers([])
      return undefined
    }

    const controller = new AbortController()
    setLoading((current) => ({ ...current, drivers: true }))
    setErrors((current) => ({ ...current, drivers: null }))

    getDrivers(selection.season, selection.event, selection.session, controller.signal)
      .then((payload) => {
        if (!controller.signal.aborted) {
          setDrivers(payload.drivers)
        }
      })
      .catch((error: unknown) => {
        if (!isAbortedRequest(error)) {
          setErrors((current) => ({ ...current, drivers: getErrorMessage(error) }))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading((current) => ({ ...current, drivers: false }))
        }
      })

    return () => controller.abort()
  }, [selection.event, selection.season, selection.session])

  useEffect(() => {
    if (
      selection.season === null ||
      selection.event === null ||
      selection.session === null ||
      selection.driver === null
    ) {
      setLaps([])
      return undefined
    }

    const controller = new AbortController()
    setLoading((current) => ({ ...current, laps: true }))
    setErrors((current) => ({ ...current, laps: null }))

    getLaps(
      selection.season,
      selection.event,
      selection.session,
      selection.driver,
      controller.signal,
    )
      .then((payload) => {
        if (!controller.signal.aborted) {
          setLaps(payload.laps)
        }
      })
      .catch((error: unknown) => {
        if (!isAbortedRequest(error)) {
          setErrors((current) => ({ ...current, laps: getErrorMessage(error) }))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading((current) => ({ ...current, laps: false }))
        }
      })

    return () => controller.abort()
  }, [selection.driver, selection.event, selection.season, selection.session])

  const selectSeason = useCallback((season: number | null) => {
    setSelection({ season, event: null, session: null, driver: null, lap: null })
    setEvents([])
    setSessions([])
    setDrivers([])
    setLaps([])
  }, [])

  const selectEvent = useCallback((event: string | null) => {
    setSelection((current) => ({ ...current, event, session: null, driver: null, lap: null }))
    setSessions([])
    setDrivers([])
    setLaps([])
  }, [])

  const selectSession = useCallback((session: string | null) => {
    setSelection((current) => ({ ...current, session, driver: null, lap: null }))
    setDrivers([])
    setLaps([])
  }, [])

  const selectDriver = useCallback((driver: string | null) => {
    setSelection((current) => ({ ...current, driver, lap: null }))
    setLaps([])
  }, [])

  const selectLap = useCallback((lap: number | null) => {
    setSelection((current) => ({ ...current, lap }))
  }, [])

  return {
    drivers,
    errors,
    events,
    loading,
    laps,
    seasons,
    selectDriver,
    selectEvent,
    selectSeason,
    selectSession,
    selectLap,
    selection,
    sessions,
  }
}
