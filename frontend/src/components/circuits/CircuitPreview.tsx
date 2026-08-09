import type { ReactNode } from 'react'

import type { CircuitRegistryEntry } from '@/data/circuitRegistry'

interface CircuitPreviewProps {
  circuit: CircuitRegistryEntry
}

/**
 * Lightweight local circuit artwork cropped from the supplied 2025 calendar.
 * Dashboard circuit analysis continues to use its live FastF1 geometry source.
 */
export default function CircuitPreview({ circuit }: CircuitPreviewProps): ReactNode {
  if (!circuit.layoutAsset) {
    return (
      <div className="grid h-full w-full place-items-center px-[var(--space-md)] text-center">
        <p className="rc-type-caption text-[var(--color-text-muted)]">Circuit artwork unavailable</p>
      </div>
    )
  }

  return (
    <img
      src={circuit.layoutAsset}
      alt={`${circuit.name} circuit layout`}
      className="h-full w-full object-contain"
      decoding="async"
      loading="lazy"
    />
  )
}
