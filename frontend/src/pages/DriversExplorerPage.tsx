import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import DriverIdentity from '@/components/dashboard/DriverIdentity'
import Button from '@/components/ui/Button'
import { driverRegistry } from '@/data/driverRegistry'

export default function DriversExplorerPage(): ReactNode {
  const [query, setQuery] = useState('')
  const [team, setTeam] = useState('All Teams')
  const navigate = useNavigate()
  const teams = useMemo(() => [...new Set(driverRegistry.map((driver) => driver.team))].sort(), [])
  const drivers = useMemo(() => {
    const term = query.trim().toLowerCase()
    return driverRegistry.filter((driver) => {
      const matchesTeam = team === 'All Teams' || driver.team === team
      const matchesQuery = !term || [driver.fullName, driver.shortName, driver.driverNumber, driver.team, driver.abbreviation]
        .some((value) => value.toLowerCase().includes(term))
      return matchesTeam && matchesQuery
    })
  }, [query, team])

  return (
    <main className="min-h-svh bg-[var(--color-background)] px-[var(--space-md)] py-[var(--space-xl)] text-[var(--color-text-primary)] sm:px-[var(--space-xl)] lg:px-[var(--space-2xl)]">
      <div className="mx-auto max-w-7xl">
        <header className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
          <p className="rc-type-caption text-[var(--color-primary-purple)]">RaceCraft Registry</p>
          <h1 className="rc-type-page-title mt-[var(--space-sm)]">Drivers</h1>
          <p className="rc-type-body mt-[var(--space-sm)]">Browse the current Formula One driver roster and open a driver in the engineering workspace.</p>
        </header>

        <div className="mt-[var(--space-xl)] grid gap-[var(--space-md)] sm:grid-cols-[minmax(0,1fr)_14rem]">
          <label className="rc-type-caption">
            Search drivers
            <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Name, number, team, abbreviation" className="mt-[var(--space-sm)] w-full border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--font-size-body)] text-[var(--color-text-primary)] outline-none transition-[border-color] duration-[var(--duration-fast)] focus:border-[var(--color-primary-purple)]" />
          </label>
          <label className="rc-type-caption">
            Team
            <select value={team} onChange={(event) => setTeam(event.currentTarget.value)} className="mt-[var(--space-sm)] w-full border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--font-size-body)] text-[var(--color-text-primary)] outline-none transition-[border-color] duration-[var(--duration-fast)] focus:border-[var(--color-primary-purple)]">
              <option>All Teams</option>
              {teams.map((constructor) => <option key={constructor}>{constructor}</option>)}
            </select>
          </label>
        </div>

        <p aria-live="polite" className="mt-[var(--space-md)] rc-type-caption">{drivers.length} drivers</p>
        <section aria-label="Formula One drivers" className="mt-[var(--space-md)] grid gap-[var(--space-md)] sm:grid-cols-2 xl:grid-cols-3">
          {drivers.map((driver) => (
            <article key={driver.id} className="rc-card flex min-w-0 flex-col border-l-2" style={{ borderLeftColor: driver.accentColor }}>
              <DriverIdentity driver={driver} />
              <dl className="mt-[var(--space-lg)] grid grid-cols-2 gap-[var(--space-md)] border-t border-[var(--color-border)] pt-[var(--space-md)]">
                <div><dt className="rc-metric-label">Nationality</dt><dd className="mt-[var(--space-xs)] text-[var(--font-size-small)] text-[var(--color-text-primary)]">{driver.country}</dd></div>
                <div><dt className="rc-metric-label">Constructor</dt><dd className="mt-[var(--space-xs)] truncate text-[var(--font-size-small)] text-[var(--color-text-primary)]">{driver.team}</dd></div>
              </dl>
              <div className="mt-[var(--space-lg)] flex flex-wrap gap-[var(--space-sm)] border-t border-[var(--color-border)] pt-[var(--space-md)]">
                <Button variant="ghost" size="sm" aria-label={`View ${driver.fullName} profile`}>View Profile</Button>
                <Button size="sm" onClick={() => navigate(`/dashboard?driver=${encodeURIComponent(driver.abbreviation)}`)}>Analyze Driver</Button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
