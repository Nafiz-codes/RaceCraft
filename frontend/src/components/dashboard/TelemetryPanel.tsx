import type { ReactNode } from 'react'

import TelemetryChart from '@/components/dashboard/TelemetryChart'
import useTelemetry, { type TelemetrySelection } from '@/hooks/useTelemetry'

interface TelemetryPanelProps {
  selection: TelemetrySelection
}

export default function TelemetryPanel({ selection }: TelemetryPanelProps): ReactNode {
  const { data, error, isLoading } = useTelemetry(selection)

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
  } else if (data && data.telemetry.length > 0) {
    content = <TelemetryChart telemetry={data.telemetry} channel="speed" />
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
