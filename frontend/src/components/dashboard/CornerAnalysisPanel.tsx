import type { ReactNode } from 'react'

import type { CircuitCorner } from '@/types/corner'

interface CornerAnalysisPanelProps {
  corners: CircuitCorner[] | undefined
  error: string | null
  isLoading: boolean
  selectedCornerNumber: number | null
  onCornerSelect: (cornerNumber: number) => void
}

function formatDistance(distance: number | null): string {
  return distance === null ? 'Unavailable' : `${distance.toFixed(1)} m`
}

export default function CornerAnalysisPanel({
  corners,
  error,
  isLoading,
  selectedCornerNumber,
  onCornerSelect,
}: CornerAnalysisPanelProps): ReactNode {
  let content: ReactNode = (
    <p className="text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
      Select a primary session to load official circuit corners.
    </p>
  )

  if (isLoading) {
    content = <div className="rc-skeleton h-48 border border-[var(--color-border)]" aria-label="Loading circuit corners" />
  } else if (error) {
    content = <p className="text-[var(--font-size-small)] text-[var(--color-error)]">{error}</p>
  } else if (corners && corners.length > 0) {
    content = (
      <div className="max-h-72 overflow-auto border border-[var(--color-border)]">
        <table className="min-w-[34rem] w-full border-collapse [font-family:var(--font-family-mono)] text-[var(--font-size-caption)]">
          <thead className="sticky top-0 bg-[var(--color-background-secondary)] text-left uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            <tr>
              <th className="whitespace-nowrap p-[var(--space-sm)] font-[var(--font-weight-medium)]">Corner</th>
              <th className="whitespace-nowrap p-[var(--space-sm)] font-[var(--font-weight-medium)]">Letter</th>
              <th className="whitespace-nowrap p-[var(--space-sm)] font-[var(--font-weight-medium)]">Distance</th>
              <th className="whitespace-nowrap p-[var(--space-sm)] font-[var(--font-weight-medium)]">Coordinates</th>
            </tr>
          </thead>
          <tbody>
            {corners.map((corner) => {
              const isSelected = corner.cornerNumber === selectedCornerNumber
              return (
                <tr key={corner.cornerNumber} className="border-t border-[var(--color-border)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface)]">
                  <td className="p-0">
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onCornerSelect(corner.cornerNumber)}
                      className={`w-full px-[var(--space-sm)] py-2 text-left transition-colors duration-[var(--duration-fast)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[var(--color-primary-purple)] ${isSelected ? 'bg-[var(--color-surface)] text-[var(--color-primary-purple)]' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'}`}
                    >
                      {corner.cornerNumber}
                    </button>
                  </td>
                  <td className="p-[var(--space-sm)] text-[var(--color-text-secondary)]">{corner.cornerLetter ?? '—'}</td>
                  <td className="p-[var(--space-sm)] text-[var(--color-text-secondary)]">{formatDistance(corner.distance)}</td>
                  <td className="p-[var(--space-sm)] text-[var(--color-text-secondary)]">{corner.x.toFixed(0)}, {corner.y.toFixed(0)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <section id="corner-analysis" aria-labelledby="corner-analysis-title" className="flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-4">
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">System 3D</p>
        <h2 id="corner-analysis-title" className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]">Corner Analysis</h2>
      </div>
      <div className="mt-[var(--space-lg)] border-t border-[var(--color-border)] pt-[var(--space-lg)]">{content}</div>
    </section>
  )
}
