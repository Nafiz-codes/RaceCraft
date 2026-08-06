import type { ReactNode } from 'react'

import useDashboardComparison from '@/hooks/useDashboardComparison'
import useSessionDiscovery from '@/hooks/useSessionDiscovery'

type DiscoveryState = ReturnType<typeof useSessionDiscovery>

interface SessionSelectorProps {
  discovery: DiscoveryState
}

interface SelectionFieldsProps {
  discovery: DiscoveryState
}

function getStatusMessage(discovery: DiscoveryState): string {
  const { errors, loading, selection } = discovery
  const error = errors.seasons ?? errors.events ?? errors.sessions ?? errors.drivers ?? errors.laps
  if (error) {
    return error
  }
  if (loading.seasons) {
    return 'Loading seasons...'
  }
  if (loading.events) {
    return 'Loading events...'
  }
  if (loading.sessions) {
    return 'Loading sessions...'
  }
  if (loading.drivers) {
    return 'Loading drivers...'
  }
  if (loading.laps) {
    return 'Loading lap options...'
  }
  if (selection.driver) {
    return 'Driver context ready.'
  }

  return 'Choose a season, event, session, and driver to initialize the workspace.'
}

function hasError(discovery: DiscoveryState): boolean {
  const { errors } = discovery
  return Boolean(errors.seasons ?? errors.events ?? errors.sessions ?? errors.drivers ?? errors.laps)
}

function SelectionFields({ discovery }: SelectionFieldsProps): ReactNode {
  const {
    drivers,
    events,
    laps,
    loading,
    seasons,
    selectDriver,
    selectEvent,
    selectLap,
    selectSeason,
    selectSession,
    selection,
    sessions,
  } = discovery
  const selectClassName =
    'mt-[calc(var(--space-sm)/2)] w-full border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-[var(--space-sm)] py-[var(--space-sm)] text-[var(--font-size-small)] text-[var(--color-text-primary)] outline-none transition-[border-color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-primary-purple)] focus-visible:ring-1 focus-visible:ring-[var(--color-primary-purple)] disabled:cursor-not-allowed disabled:text-[var(--color-text-muted)]'

  return (
    <div className="grid gap-[var(--space-md)] sm:grid-cols-2">
      <label className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        Season
        <select value={selection.season ?? ''} onChange={(event) => selectSeason(event.currentTarget.value ? Number(event.currentTarget.value) : null)} disabled={loading.seasons} className={selectClassName}>
          <option value="">Select season</option>
          {seasons.map((season) => <option key={season.year} value={season.year}>{season.year}</option>)}
        </select>
      </label>
      <label className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        Event
        <select value={selection.event ?? ''} onChange={(event) => selectEvent(event.currentTarget.value || null)} disabled={selection.season === null || loading.events} className={selectClassName}>
          <option value="">Select event</option>
          {events.map((event) => <option key={`${event.round}-${event.eventName}`} value={event.eventName}>{event.eventName}</option>)}
        </select>
      </label>
      <label className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        Session
        <select value={selection.session ?? ''} onChange={(event) => selectSession(event.currentTarget.value || null)} disabled={selection.event === null || loading.sessions} className={selectClassName}>
          <option value="">Select session</option>
          {sessions.map((session) => <option key={session.sessionKey} value={session.sessionName}>{session.sessionName}</option>)}
        </select>
      </label>
      <label className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        Driver
        <select value={selection.driver ?? ''} onChange={(event) => selectDriver(event.currentTarget.value || null)} disabled={selection.session === null || loading.drivers} className={selectClassName}>
          <option value="">Select driver</option>
          {drivers.map((driver) => <option key={driver.driverNumber} value={driver.abbreviation}>{driver.fullName} / {driver.teamName}</option>)}
        </select>
      </label>
      <label className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        Lap
        <select value={selection.lap ?? ''} onChange={(event) => selectLap(event.currentTarget.value ? Number(event.currentTarget.value) : null)} disabled={selection.driver === null || loading.laps} className={selectClassName}>
          <option value="">Select lap</option>
          {laps.map((lap) => <option key={lap.lapNumber} value={lap.lapNumber}>Lap {lap.lapNumber}</option>)}
        </select>
      </label>
    </div>
  )
}

function SelectionGroup({ label, discovery }: { label: 'Primary' | 'Secondary'; discovery: DiscoveryState }): ReactNode {
  return (
    <div>
      <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">
        {label}
      </p>
      <div className="mt-[var(--space-sm)]">
        <SelectionFields discovery={discovery} />
      </div>
      <p aria-live="polite" className={`mt-[var(--space-md)] text-[var(--font-size-small)] leading-[var(--line-height-small)] ${hasError(discovery) ? 'text-[var(--color-error)]' : 'text-[var(--color-text-secondary)]'}`}>
        {getStatusMessage(discovery)}
      </p>
    </div>
  )
}

export default function SessionSelector({ discovery }: SessionSelectorProps): ReactNode {
  const { comparisonEnabled, setComparisonEnabled } = useDashboardComparison()
  const secondaryDiscovery = useSessionDiscovery('secondary')

  return (
    <section id="session-selector" aria-labelledby="session-selector-title" className="flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-[var(--space-md)] border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <div>
          <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">System 1A</p>
          <h2 id="session-selector-title" className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]">Session Selector</h2>
        </div>
        <div className="grid gap-1 text-right">
          <span className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Comparison Mode</span>
          <div role="group" aria-label="Comparison mode" className="inline-flex border border-[var(--color-border)] p-0.5">
            <button type="button" aria-pressed={!comparisonEnabled} onClick={() => setComparisonEnabled(false)} className={`px-[var(--space-sm)] py-1 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] transition-colors duration-[var(--duration-fast)] ${!comparisonEnabled ? 'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}>Off</button>
            <button type="button" aria-pressed={comparisonEnabled} onClick={() => setComparisonEnabled(true)} className={`px-[var(--space-sm)] py-1 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] transition-colors duration-[var(--duration-fast)] ${comparisonEnabled ? 'bg-[var(--color-primary-purple)] text-[var(--color-background)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}>On</button>
          </div>
        </div>
      </div>

      <div className="mt-[var(--space-lg)]">
        <SelectionGroup label="Primary" discovery={discovery} />
        {comparisonEnabled && (
          <div className="mt-[var(--space-lg)] border-t border-[var(--color-border)] pt-[var(--space-lg)]">
            <SelectionGroup label="Secondary" discovery={secondaryDiscovery} />
          </div>
        )}
      </div>
    </section>
  )
}
