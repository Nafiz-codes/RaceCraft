import { useEffect, useState, type ReactNode } from 'react'

import SessionSelector from '@/components/dashboard/SessionSelector'
import CircuitView from '@/components/dashboard/CircuitView'
import TelemetryPanel from '@/components/dashboard/TelemetryPanel'
import useSessionDiscovery from '@/hooks/useSessionDiscovery'
import useComparisonTelemetry from '@/hooks/useComparisonTelemetry'
import useDashboardComparison from '@/hooks/useDashboardComparison'

interface DashboardModule {
  id: string
  system: string
  title: string
  description: string
  className?: string
}

function DashboardModulePanel({ module }: { module: DashboardModule }): ReactNode {
  return (
    <section
      id={module.id}
      aria-labelledby={`${module.id}-title`}
      className={`flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] ${module.className ?? ''}`}
    >
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">
          {module.system}
        </p>
        <h2
          id={`${module.id}-title`}
          className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]"
        >
          {module.title}
        </h2>
      </div>

      <div className="mt-auto border-t border-[var(--color-border)] pt-[var(--space-lg)]">
        <p className="max-w-md text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
          {module.description}
        </p>
      </div>
    </section>
  )
}

export default function MainContent(): ReactNode {
  const discovery = useSessionDiscovery()
  const telemetry = useComparisonTelemetry()
  const { secondarySelection } = useDashboardComparison()
  const [selectedTelemetryIndex, setSelectedTelemetryIndex] = useState(0)
  const selectedDriver = discovery.drivers.find(
    (driver) => driver.abbreviation === discovery.selection.driver,
  )
  const selectedLap = discovery.laps.find((lap) => lap.lapNumber === discovery.selection.lap)

  useEffect(() => {
    setSelectedTelemetryIndex(0)
  }, [telemetry.primaryTelemetry])

  return (
    <main className="min-w-0 overflow-y-auto px-[var(--space-md)] py-[var(--space-md)] sm:px-[var(--space-lg)] sm:py-[var(--space-lg)] lg:px-[var(--space-xl)] lg:py-[var(--space-xl)]">
      <div className="grid gap-[var(--space-md)] lg:grid-cols-12">
        <SessionSelector discovery={discovery} />
        <DashboardModulePanel
          module={{
            id: 'driver-comparison-module',
            system: 'System 2B',
            title: 'Driver Comparison',
            description: 'Configure the drivers and laps that will be compared.',
            className: 'lg:col-span-4',
          }}
        />
        <CircuitView
          selection={discovery.selection}
          telemetry={telemetry.primaryTelemetry}
          selectedTelemetryIndex={selectedTelemetryIndex}
        />
        <DashboardModulePanel
          module={{
            id: 'lap-analysis',
            system: 'System 4D',
            title: 'Lap Analysis',
            description: 'Lap and sector context will appear for the selected reference.',
            className: 'lg:col-span-4',
          }}
        />
        <DashboardModulePanel
          module={{
            id: 'weather-module',
            system: 'System 5E',
            title: 'Weather',
            description: 'Track and atmospheric conditions will appear with session data.',
            className: 'lg:col-span-4',
          }}
        />
        <TelemetryPanel
          selection={discovery.selection}
          driver={selectedDriver}
          lap={selectedLap}
          telemetry={telemetry.primaryTelemetry}
          secondaryTelemetry={telemetry.secondaryTelemetry}
          comparisonEnabled={telemetry.comparisonEnabled}
          primaryDriverAbbreviation={discovery.selection.driver}
          secondaryDriverAbbreviation={secondarySelection.driver}
          error={telemetry.primaryError}
          isLoading={telemetry.primaryLoading}
          selectedTelemetryIndex={selectedTelemetryIndex}
          onTelemetryIndexChange={setSelectedTelemetryIndex}
        />
      </div>
    </main>
  )
}
