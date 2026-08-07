import { useMemo, type ReactNode } from 'react'

import DriverIdentity from '@/components/dashboard/DriverIdentity'
import type { Driver } from '@/types/discovery'
import type { TelemetryModel } from '@/types/telemetry'

interface DriverHUDProps {
  driver: Driver | undefined
  telemetry: TelemetryModel[] | undefined
  selectedTelemetryIndex: number
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString()
}

function HudMetric({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div className="border border-[var(--color-border)] p-[var(--space-sm)]">
      <dt className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 [font-family:var(--font-family-mono)] text-[var(--font-size-small)] text-[var(--color-text-primary)]">
        {value}
      </dd>
    </div>
  )
}

export default function DriverHUD({ driver, telemetry, selectedTelemetryIndex }: DriverHUDProps): ReactNode {
  const activeSample = useMemo(
    () => telemetry?.[selectedTelemetryIndex],
    [selectedTelemetryIndex, telemetry],
  )

  let content: ReactNode = (
    <div className="space-y-[var(--space-lg)]">
      <DriverIdentity driver={driver} variant="compact" />
      <p className="text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
        Select a driver lap to load live telemetry values.
      </p>
    </div>
  )

  if (activeSample) {
    content = (
      <div className="space-y-[var(--space-md)]">
        <DriverIdentity driver={driver} variant="compact" />
        <dl className="grid grid-cols-2 border border-[var(--color-border)] sm:grid-cols-3 xl:grid-cols-6">
        <HudMetric label="Speed" value={`${formatNumber(activeSample.speed)} km/h`} />
        <HudMetric label="RPM" value={formatNumber(activeSample.rpm)} />
        <HudMetric label="Gear" value={String(activeSample.gear)} />
        <HudMetric label="Throttle" value={`${formatNumber(activeSample.throttle)}%`} />
        <HudMetric label="Brake" value={activeSample.brake ? 'ON' : 'OFF'} />
        <HudMetric label="DRS" value={activeSample.drs >= 10 ? 'OPEN' : 'CLOSED'} />
        </dl>
      </div>
    )
  }

  return (
    <section
      id="driver-hud"
      aria-labelledby="driver-hud-title"
      aria-live="polite"
      className="flex min-h-44 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-12"
    >
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">
          System 6E
        </p>
        <h2
          id="driver-hud-title"
          className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]"
        >
          Driver HUD
        </h2>
      </div>
      <div className="mt-[var(--space-lg)] border-t border-[var(--color-border)] pt-[var(--space-lg)]">
        {content}
      </div>
    </section>
  )
}
