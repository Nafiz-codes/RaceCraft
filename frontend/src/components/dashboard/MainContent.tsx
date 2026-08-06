import { useEffect, useState, type ReactNode } from 'react'

import SessionSelector from '@/components/dashboard/SessionSelector'
import CircuitView from '@/components/dashboard/CircuitView'
import CircuitInformationPanel from '@/components/dashboard/CircuitInformationPanel'
import DriverComparisonPanel from '@/components/dashboard/DriverComparisonPanel'
import LapAnalysisPanel from '@/components/dashboard/LapAnalysisPanel'
import WeatherPanel from '@/components/dashboard/WeatherPanel'
import TelemetryPanel from '@/components/dashboard/TelemetryPanel'
import useSessionDiscovery from '@/hooks/useSessionDiscovery'
import useComparisonTelemetry from '@/hooks/useComparisonTelemetry'
import useDashboardComparison from '@/hooks/useDashboardComparison'
import useSessionWeather from '@/hooks/useSessionWeather'
import useCircuitInformation from '@/hooks/useCircuitInformation'

export default function MainContent(): ReactNode {
  const discovery = useSessionDiscovery()
  const secondaryDiscovery = useSessionDiscovery('secondary')
  const telemetry = useComparisonTelemetry()
  const weather = useSessionWeather(discovery.selection)
  const circuitInformation = useCircuitInformation(discovery.selection)
  const { secondarySelection } = useDashboardComparison()
  const [selectedTelemetryIndex, setSelectedTelemetryIndex] = useState(0)
  const selectedDriver = discovery.drivers.find(
    (driver) => driver.abbreviation === discovery.selection.driver,
  )
  const selectedLap = discovery.laps.find((lap) => lap.lapNumber === discovery.selection.lap)
  const selectedSecondaryDriver = secondaryDiscovery.drivers.find(
    (driver) => driver.abbreviation === secondaryDiscovery.selection.driver,
  )
  const selectedSecondaryLap = secondaryDiscovery.laps.find(
    (lap) => lap.lapNumber === secondaryDiscovery.selection.lap,
  )

  useEffect(() => {
    setSelectedTelemetryIndex(0)
  }, [telemetry.primaryTelemetry])

  return (
    <main className="min-w-0 overflow-y-auto px-[var(--space-md)] py-[var(--space-md)] sm:px-[var(--space-lg)] sm:py-[var(--space-lg)] lg:px-[var(--space-xl)] lg:py-[var(--space-xl)]">
      <div className="grid gap-[var(--space-md)] lg:grid-cols-12">
        <SessionSelector discovery={discovery} secondaryDiscovery={secondaryDiscovery} />
        <DriverComparisonPanel
          comparisonEnabled={telemetry.comparisonEnabled}
          primaryDriver={selectedDriver}
          primaryLap={selectedLap}
          primaryTelemetry={telemetry.primaryTelemetry}
          secondaryDriver={selectedSecondaryDriver}
          secondaryLap={selectedSecondaryLap}
          secondaryTelemetry={telemetry.secondaryTelemetry}
        />
        <CircuitView
          selection={discovery.selection}
          telemetry={telemetry.primaryTelemetry}
          selectedTelemetryIndex={selectedTelemetryIndex}
        />
        <LapAnalysisPanel lap={selectedLap} telemetry={telemetry.primaryTelemetry} />
        <WeatherPanel weather={weather.data?.weather} error={weather.error} isLoading={weather.isLoading} />
        <CircuitInformationPanel
          circuit={circuitInformation.data?.circuit}
          error={circuitInformation.error}
          isLoading={circuitInformation.isLoading}
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
