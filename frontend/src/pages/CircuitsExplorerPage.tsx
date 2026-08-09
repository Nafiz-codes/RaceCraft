import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import CircuitPreview from '@/components/circuits/CircuitPreview'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import { circuitRegistry } from '@/data/circuitRegistry'

export default function CircuitsExplorerPage(): ReactNode {
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('All Countries')
  const navigate = useNavigate()
  const countries = useMemo(() => [...new Set(circuitRegistry.map((circuit) => circuit.country))].sort(), [])
  const circuits = useMemo(() => circuitRegistry.filter((circuit) => {
    const term = query.trim().toLowerCase()
    return (country === 'All Countries' || circuit.country === country) && (!term || [circuit.name, circuit.country, circuit.city, String(circuit.calendarRound)].some((value) => value.toLowerCase().includes(term)))
  }), [country, query])

  return (
    <>
      <Navbar />
      <main className="min-h-svh bg-[var(--color-background)] px-[var(--space-md)] py-[var(--space-xl)] text-[var(--color-text-primary)] sm:px-[var(--space-xl)] lg:px-[var(--space-2xl)]">
        <div className="mx-auto max-w-7xl">
          <header className="border-l-2 border-[var(--color-f1-red)] pl-[var(--space-md)]">
            <p className="rc-type-caption text-[var(--color-f1-red)]">RaceCraft Registry</p>
            <h1 className="rc-type-page-title mt-[var(--space-sm)]">Circuits</h1>
          </header>
          <div className="mt-[var(--space-xl)] grid gap-[var(--space-md)] sm:grid-cols-[minmax(0,1fr)_14rem]">
            <label className="rc-type-caption">Search circuits<input value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Name, country, city, round" className="mt-[var(--space-sm)] w-full border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--font-size-body)] text-[var(--color-text-primary)]" /></label>
            <label className="rc-type-caption">Country<select value={country} onChange={(event) => setCountry(event.currentTarget.value)} className="mt-[var(--space-sm)] w-full border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--font-size-body)] text-[var(--color-text-primary)]"><option>All Countries</option>{countries.map((value) => <option key={value}>{value}</option>)}</select></label>
          </div>
          <section aria-label="Formula One circuits" className="mt-[var(--space-xl)] grid gap-[var(--space-md)] sm:grid-cols-2 xl:grid-cols-3">
            {circuits.map((circuit) => (
              <article key={circuit.id} className="rc-card min-w-0 overflow-hidden">
                <div className="grid h-40 place-items-center border border-[var(--color-border)] bg-[var(--color-background-secondary)] p-[var(--space-sm)]">
                  <CircuitPreview circuit={circuit} />
                </div>
                <h2 className="rc-type-card-title mt-[var(--space-md)]">{circuit.name}</h2>
                <p className="mt-[var(--space-xs)] text-[var(--font-size-small)] text-[var(--color-text-secondary)]">{circuit.country} · {circuit.city}</p>
                <dl className="mt-[var(--space-md)] grid grid-cols-2 gap-[var(--space-md)] border-t border-[var(--color-border)] pt-[var(--space-md)]">
                  <div><dt className="rc-metric-label">Length</dt><dd className="mt-[var(--space-xs)] text-[var(--font-size-small)]">{circuit.length}</dd></div>
                  <div><dt className="rc-metric-label">Corners</dt><dd className="mt-[var(--space-xs)] text-[var(--font-size-small)]">{circuit.officialCornerCount}</dd></div>
                </dl>
                <div className="mt-[var(--space-lg)] border-t border-[var(--color-border)] pt-[var(--space-md)]">
                  <Button size="sm" onClick={() => navigate(`/dashboard?circuit=${encodeURIComponent(circuit.name)}`)}>Analyze Circuit</Button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  )
}
