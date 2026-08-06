import { useState, type ReactNode } from 'react'

import TelemetryChart, { type TelemetryChannel } from '@/components/dashboard/TelemetryChart'
import DeltaTimeChart from '@/components/dashboard/DeltaTimeChart'
import { type TelemetrySelection } from '@/hooks/useTelemetry'
import type { Driver, Lap } from '@/types/discovery'
import type { TelemetryModel } from '@/types/telemetry'

interface TelemetryPanelProps {
  selection: TelemetrySelection
  driver: Driver | undefined
  lap: Lap | undefined
  telemetry: TelemetryModel[] | undefined
  secondaryTelemetry: TelemetryModel[] | undefined
  comparisonEnabled: boolean
  primaryDriverAbbreviation: string | null
  secondaryDriverAbbreviation: string | null
  error: string | null
  isLoading: boolean
  selectedTelemetryIndex: number
  onTelemetryIndexChange: (index: number) => void
}

const CHANNELS: TelemetryChannel[] = ['speed', 'throttle', 'brake', 'rpm', 'gear', 'drs']

function formatChannel(channel: TelemetryChannel): string {
  return channel === 'rpm' ? 'RPM' : channel === 'drs' ? 'DRS' : `${channel[0].toUpperCase()}${channel.slice(1)}`
}

export default function TelemetryPanel({
  selection,
  driver,
  lap,
  telemetry,
  secondaryTelemetry,
  comparisonEnabled,
  primaryDriverAbbreviation,
  secondaryDriverAbbreviation,
  error,
  isLoading,
  selectedTelemetryIndex,
  onTelemetryIndexChange,
}: TelemetryPanelProps): ReactNode {
  const [channel, setChannel] = useState<TelemetryChannel>('speed')

  let content: ReactNode = (
    <p className="text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
      Select a driver lap to load raw telemetry.
    </p>
  )

  if (isLoading) {
    content = (
      <p className="text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
        Loading telemetry...
      </p>
    )
  } else if (error) {
    content = (
      <p className="text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-error)]">
        {error}
      </p>
    )
  } else if (telemetry && telemetry.length > 0) {
    content = (
      <>
        <dl className="grid grid-cols-2 border border-[var(--color-border)] sm:grid-cols-3 xl:grid-cols-6">
          <div className="border-b border-r border-[var(--color-border)] p-[var(--space-sm)] xl:border-b-0">
            <dt className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Driver</dt>
            <dd className="mt-1 truncate text-[var(--font-size-small)] text-[var(--color-text-primary)]">{driver?.fullName ?? selection.driver}</dd>
          </div>
          <div className="border-b border-[var(--color-border)] p-[var(--space-sm)] sm:border-r xl:border-b-0">
            <dt className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Session</dt>
            <dd className="mt-1 truncate text-[var(--font-size-small)] text-[var(--color-text-primary)]">{selection.session}</dd>
          </div>
          <div className="border-b border-r border-[var(--color-border)] p-[var(--space-sm)] sm:border-b-0">
            <dt className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Lap Number</dt>
            <dd className="mt-1 [font-family:var(--font-family-mono)] text-[var(--font-size-small)] text-[var(--color-text-primary)]">{lap?.lapNumber ?? selection.lap}</dd>
          </div>
          <div className="border-b border-[var(--color-border)] p-[var(--space-sm)] sm:border-b-0 sm:border-r">
            <dt className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Tyre Compound</dt>
            <dd className="mt-1 [font-family:var(--font-family-mono)] text-[var(--font-size-small)] text-[var(--color-text-primary)]">{lap?.tyreCompound ?? '—'}</dd>
          </div>
          <div className="border-r border-[var(--color-border)] p-[var(--space-sm)]">
            <dt className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Lap Time</dt>
            <dd className="mt-1 [font-family:var(--font-family-mono)] text-[var(--font-size-small)] text-[var(--color-text-primary)]">{lap?.lapTime ?? '—'}</dd>
          </div>
          <div className="p-[var(--space-sm)]">
            <dt className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Sample Count</dt>
            <dd className="mt-1 [font-family:var(--font-family-mono)] text-[var(--font-size-small)] text-[var(--color-text-primary)]">{telemetry.length}</dd>
          </div>
        </dl>
        <div className="mt-[var(--space-lg)]">
          {comparisonEnabled && (
            <div className="mb-[var(--space-sm)] flex flex-wrap gap-[var(--space-md)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]" aria-label="Telemetry comparison legend">
              <span className="inline-flex items-center gap-1.5"><span className="h-px w-4 bg-[var(--color-primary-purple)]" />Primary {primaryDriverAbbreviation ?? '--'}</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-4 border-t border-dashed border-[var(--color-text-muted)]" />Secondary {secondaryDriverAbbreviation ?? '--'}</span>
            </div>
          )}
          <TelemetryChart
            telemetry={telemetry}
            secondaryTelemetry={secondaryTelemetry}
            comparisonEnabled={comparisonEnabled}
            channel={channel}
            selectedTelemetryIndex={selectedTelemetryIndex}
            onTelemetryIndexChange={onTelemetryIndexChange}
          />
          {comparisonEnabled && secondaryTelemetry && secondaryTelemetry.length > 0 && (
            <DeltaTimeChart
              primaryTelemetry={telemetry}
              secondaryTelemetry={secondaryTelemetry}
            />
          )}
        </div>
        <div className="mt-[var(--space-md)] flex flex-wrap gap-1 border-t border-[var(--color-border)] pt-[var(--space-md)]" aria-label="Telemetry channel">
          {CHANNELS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={channel === item}
              onClick={() => setChannel(item)}
              className={`border px-[var(--space-sm)] py-1 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] transition-colors duration-[var(--duration-fast)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-purple)] ${channel === item ? 'border-[var(--color-primary-purple)] bg-[var(--color-background-secondary)] text-[var(--color-text-primary)]' : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-secondary)]'}`}
            >
              {formatChannel(item)}
            </button>
          ))}
        </div>
        <label className="mt-[var(--space-md)] grid gap-2 border-t border-[var(--color-border)] pt-[var(--space-md)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
          <span className="flex items-center justify-between">
            <span>Position scrubber</span>
            <span>Sample {selectedTelemetryIndex + 1} / {telemetry.length}</span>
          </span>
          <input
            type="range"
            min={0}
            max={telemetry.length - 1}
            value={selectedTelemetryIndex}
            onChange={(event) => onTelemetryIndexChange(Number(event.currentTarget.value))}
            className="h-1 w-full cursor-pointer accent-[var(--color-primary-purple)]"
            aria-label="Telemetry position"
          />
        </label>
      </>
    )
  }

  return (
    <section
      id="telemetry-module"
      aria-labelledby="telemetry-module-title"
      aria-live="polite"
      className="flex min-h-44 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-12"
    >
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">
          System 6F
        </p>
        <h2
          id="telemetry-module-title"
          className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]"
        >
          Telemetry
        </h2>
      </div>
      <div className="mt-[var(--space-lg)] border-t border-[var(--color-border)] pt-[var(--space-lg)]">
        {content}
      </div>
    </section>
  )
}
