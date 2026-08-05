import type { ReactNode } from "react"

import useSessionDiscovery from "@/hooks/useSessionDiscovery"

interface SessionSelectorProps {
  discovery: ReturnType<typeof useSessionDiscovery>
}

function getStatusMessage({
  driverSelected,
  errors,
  loading,
}: {
  driverSelected: boolean
  errors: ReturnType<typeof useSessionDiscovery>["errors"]
  loading: ReturnType<typeof useSessionDiscovery>["loading"]
}): string {
  const error = errors.seasons ?? errors.events ?? errors.sessions ?? errors.drivers ?? errors.laps
  if (error) {
    return error
  }

  if (loading.seasons) {
    return "Loading seasons…"
  }
  if (loading.events) {
    return "Loading events…"
  }
  if (loading.sessions) {
    return "Loading sessions…"
  }
  if (loading.drivers) {
    return "Loading drivers…"
  }
  if (loading.laps) {
    return "Loading lap options..."
  }
  if (driverSelected) {
    return "Driver context ready."
  }

  return "Choose a season, event, session, and driver to initialize the workspace."
}

export default function SessionSelector({ discovery }: SessionSelectorProps): ReactNode {
  const {
    drivers,
    errors,
    events,
    laps,
    loading,
    seasons,
    selectDriver,
    selectEvent,
    selectSeason,
    selectSession,
    selectLap,
    selection,
    sessions,
  } = discovery
  const statusMessage = getStatusMessage({
    driverSelected: selection.driver !== null,
    errors,
    loading,
  })
  const selectClassName =
    "mt-[calc(var(--space-sm)/2)] w-full border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-[var(--space-sm)] py-[var(--space-sm)] text-[var(--font-size-small)] text-[var(--color-text-primary)] outline-none transition-[border-color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-primary-purple)] focus-visible:ring-1 focus-visible:ring-[var(--color-primary-purple)] disabled:cursor-not-allowed disabled:text-[var(--color-text-muted)]"

  return (
    <section
      id="session-selector"
      aria-labelledby="session-selector-title"
      className="flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-8"
    >
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">
          System 1A
        </p>
        <h2
          id="session-selector-title"
          className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]"
        >
          Session Selector
        </h2>
      </div>

      <div className="mt-[var(--space-lg)] grid gap-[var(--space-md)] sm:grid-cols-2">
        <label className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
          Season
          <select
            value={selection.season ?? ""}
            onChange={(event) => {
              const value = event.currentTarget.value
              selectSeason(value ? Number(value) : null)
            }}
            disabled={loading.seasons}
            className={selectClassName}
          >
            <option value="">Select season</option>
            {seasons.map((season) => (
              <option key={season.year} value={season.year}>
                {season.year}
              </option>
            ))}
          </select>
        </label>

        <label className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
          Event
          <select
            value={selection.event ?? ""}
            onChange={(event) => selectEvent(event.currentTarget.value || null)}
            disabled={selection.season === null || loading.events}
            className={selectClassName}
          >
            <option value="">Select event</option>
            {events.map((event) => (
              <option key={`${event.round}-${event.eventName}`} value={event.eventName}>
                {event.eventName}
              </option>
            ))}
          </select>
        </label>

        <label className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
          Session
          <select
            value={selection.session ?? ""}
            onChange={(event) => selectSession(event.currentTarget.value || null)}
            disabled={selection.event === null || loading.sessions}
            className={selectClassName}
          >
            <option value="">Select session</option>
            {sessions.map((session) => (
              <option key={session.sessionKey} value={session.sessionName}>
                {session.sessionName}
              </option>
            ))}
          </select>
        </label>

        <label className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
          Driver
          <select
            value={selection.driver ?? ""}
            onChange={(event) => selectDriver(event.currentTarget.value || null)}
            disabled={selection.session === null || loading.drivers}
            className={selectClassName}
          >
            <option value="">Select driver</option>
            {drivers.map((driver) => (
              <option key={driver.driverNumber} value={driver.abbreviation}>
                {driver.fullName} · {driver.teamName}
              </option>
            ))}
          </select>
        </label>
        <label className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
          Lap
          <select
            value={selection.lap ?? ""}
            onChange={(event) => {
              const value = event.currentTarget.value
              selectLap(value ? Number(value) : null)
            }}
            disabled={selection.driver === null || loading.laps}
            className={selectClassName}
          >
            <option value="">Select lap</option>
            {laps.map((lap) => (
              <option key={lap.lapNumber} value={lap.lapNumber}>
                Lap {lap.lapNumber}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p
        aria-live="polite"
        className={`mt-auto border-t border-[var(--color-border)] pt-[var(--space-lg)] text-[var(--font-size-small)] leading-[var(--line-height-small)] ${
          errors.seasons || errors.events || errors.sessions || errors.drivers || errors.laps
            ? "text-[var(--color-error)]"
            : "text-[var(--color-text-secondary)]"
        }`}
      >
        {statusMessage}
      </p>
    </section>
  )
}
