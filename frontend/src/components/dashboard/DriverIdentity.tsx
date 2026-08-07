import { useEffect, useMemo, useState, type ReactNode } from 'react'

import {
  getDriverByAbbreviation,
  getDriverByName,
  getDriverByNumber,
  type DriverRegistryEntry,
} from '@/data/driverRegistry'
import type { Driver } from '@/types/discovery'

type DriverIdentityVariant = 'compact' | 'card'

interface DriverIdentityProps {
  driver: Driver | DriverRegistryEntry | undefined
  variant?: DriverIdentityVariant
}

function DriverPortrait({ driver, sizeClass }: { driver: DriverRegistryEntry | undefined; sizeClass: string }): ReactNode {
  const [failed, setFailed] = useState(false)
  const portraitAsset = driver?.portraitAsset

  useEffect(() => setFailed(false), [portraitAsset])

  if (!driver || !portraitAsset || failed) {
    return (
      <div aria-label={driver ? `${driver.fullName} portrait unavailable` : 'No driver selected'} className={`${sizeClass} grid shrink-0 place-items-center overflow-hidden border border-[var(--color-border-hover)] bg-[var(--color-surface)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] text-[var(--color-text-muted)]`}>
        {driver ? driver.abbreviation : '—'}
      </div>
    )
  }

  return <img src={portraitAsset} alt={`${driver.fullName} portrait`} className={`${sizeClass} shrink-0 object-contain object-bottom`} onError={() => setFailed(true)} />
}

function ConstructorLogo({ driver }: { driver: DriverRegistryEntry }): ReactNode {
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [driver.constructorLogo])

  if (failed) {
    return <span aria-label={`${driver.team} constructor mark`} className="grid size-5 shrink-0 place-items-center border text-[9px] font-[var(--font-weight-bold)] leading-none" style={{ borderColor: driver.accentColor, color: driver.accentColor }}>{driver.team.slice(0, 2).toUpperCase()}</span>
  }

  return <img src={driver.constructorLogo} alt={`${driver.team} constructor logo`} className="size-5 shrink-0 object-contain" onError={() => setFailed(true)} />
}

function DriverFlag({ driver }: { driver: DriverRegistryEntry }): ReactNode {
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [driver.flagAsset])
  if (failed) return null

  return <img src={driver.flagAsset} alt={`${driver.country} flag`} className="h-3 w-4 shrink-0 object-contain" onError={() => setFailed(true)} />
}

export default function DriverIdentity({ driver, variant = 'card' }: DriverIdentityProps): ReactNode {
  const registeredDriver = useMemo(
    () => getDriverByAbbreviation(driver?.abbreviation) ?? getDriverByName(driver?.fullName) ?? getDriverByNumber(driver?.driverNumber),
    [driver?.abbreviation, driver?.driverNumber, driver?.fullName],
  )
  const compact = variant === 'compact'

  if (!registeredDriver) {
    return (
      <div className="flex min-w-0 items-center gap-[var(--space-sm)]">
        <DriverPortrait driver={undefined} sizeClass={compact ? 'size-10' : 'size-24'} />
        <div className="min-w-0">
          <p className="truncate text-[var(--font-size-small)] text-[var(--color-text-primary)]">No Driver Selected</p>
          <p className="mt-1 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Awaiting selection</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 items-center gap-[var(--space-sm)]">
      <DriverPortrait driver={registeredDriver} sizeClass={compact ? 'size-10' : 'size-24'} />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-baseline gap-[var(--space-sm)]">
          <p className="truncate text-[var(--font-size-small)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]">{registeredDriver.fullName}</p>
          <span className="shrink-0 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] text-[var(--color-text-muted)]">#{registeredDriver.driverNumber}</span>
          <DriverFlag driver={registeredDriver} />
        </div>
        <div className="mt-1 flex min-w-0 items-center gap-[var(--space-sm)]">
          <ConstructorLogo driver={registeredDriver} />
          <p className="truncate [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">{registeredDriver.team}</p>
        </div>
      </div>
    </div>
  )
}
