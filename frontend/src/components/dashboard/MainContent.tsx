import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import SessionSelector from '@/components/dashboard/SessionSelector'
import type { DashboardView } from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import CircuitView from '@/components/dashboard/CircuitView'
import CircuitInformationPanel from '@/components/dashboard/CircuitInformationPanel'
import BrakeComparisonPanel from '@/components/dashboard/BrakeComparisonPanel'
import CornerAnalysisPanel from '@/components/dashboard/CornerAnalysisPanel'
import CornerMetricsPanel from '@/components/dashboard/CornerMetricsPanel'
import DriverComparisonPanel from '@/components/dashboard/DriverComparisonPanel'
import DriverHUD from '@/components/dashboard/DriverHUD'
import EngineeringInsightsPanel from '@/components/dashboard/EngineeringInsightsPanel'
import ExportButton from '@/components/dashboard/ExportButton'
import {
  generateEngineeringInsights,
  type SessionReportState,
} from '@/components/dashboard/SessionReportExporter'
import LapAnalysisPanel from '@/components/dashboard/LapAnalysisPanel'
import SectorAnalysisPanel from '@/components/dashboard/SectorAnalysisPanel'
import WeatherPanel from '@/components/dashboard/WeatherPanel'
import TelemetryPanel from '@/components/dashboard/TelemetryPanel'
import useSessionDiscovery from '@/hooks/useSessionDiscovery'
import useComparisonTelemetry from '@/hooks/useComparisonTelemetry'
import useDashboardComparison from '@/hooks/useDashboardComparison'
import useSessionWeather from '@/hooks/useSessionWeather'
import useCircuitInformation from '@/hooks/useCircuitInformation'
import useCircuitCorners from '@/hooks/useCircuitCorners'
import useCircuit from '@/hooks/useCircuit'
import type { EngineeringRailState } from '@/components/dashboard/EngineeringRail'

type PlaybackSpeed = 0.5 | 1 | 2 | 4

interface MainContentProps {
  activeView: DashboardView
  onEngineeringRailChange: (state: EngineeringRailState) => void
}

export default function MainContent({ activeView, onEngineeringRailChange }: MainContentProps): ReactNode {
  const discovery = useSessionDiscovery()
  const secondaryDiscovery = useSessionDiscovery('secondary')
  const telemetry = useComparisonTelemetry()
  const weather = useSessionWeather(discovery.selection)
  const circuitInformation = useCircuitInformation(discovery.selection)
  const corners = useCircuitCorners(discovery.selection)
  const circuit = useCircuit(discovery.selection)
  const { primarySelection, secondarySelection } = useDashboardComparison()
  const [selectedTelemetryIndex, setSelectedTelemetryIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1)
  const [selectedCornerNumber, setSelectedCornerNumber] = useState<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)
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
  const selectedCorner = useMemo(
    () => corners.data?.corners.find((corner) => corner.cornerNumber === selectedCornerNumber),
    [corners.data?.corners, selectedCornerNumber],
  )
  const nearestCornerTelemetryIndex = useMemo(() => {
    if (!selectedCorner || selectedCorner.distance === null || !telemetry.primaryTelemetry) {
      return null
    }

    return telemetry.primaryTelemetry.reduce(
      (nearestIndex, sample, index, samples) =>
        Math.abs(sample.distance - selectedCorner.distance!) <
        Math.abs(samples[nearestIndex].distance - selectedCorner.distance!)
          ? index
          : nearestIndex,
      0,
    )
  }, [selectedCorner, telemetry.primaryTelemetry])
  const insights = useMemo(
    () =>
      generateEngineeringInsights({
        comparisonEnabled: telemetry.comparisonEnabled,
        primaryLap: selectedLap,
        secondaryLap: selectedSecondaryLap,
        primaryTelemetry: telemetry.primaryTelemetry,
        secondaryTelemetry: telemetry.secondaryTelemetry,
        selectedCorner,
      }),
    [
      selectedCorner,
      selectedLap,
      selectedSecondaryLap,
      telemetry.comparisonEnabled,
      telemetry.primaryTelemetry,
      telemetry.secondaryTelemetry,
    ],
  )
  const reportState = useMemo<SessionReportState>(
    () => ({
      comparisonEnabled: telemetry.comparisonEnabled,
      primarySelection,
      secondarySelection,
      primaryDriver: selectedDriver,
      secondaryDriver: selectedSecondaryDriver,
      primaryLap: selectedLap,
      secondaryLap: selectedSecondaryLap,
      primaryTelemetry: telemetry.primaryTelemetry,
      secondaryTelemetry: telemetry.secondaryTelemetry,
      circuit: circuitInformation.data?.circuit,
      weather: weather.data?.weather,
      selectedCorner,
      insights,
    }),
    [
      circuitInformation.data?.circuit,
      insights,
      primarySelection,
      secondarySelection,
      selectedCorner,
      selectedDriver,
      selectedLap,
      selectedSecondaryDriver,
      selectedSecondaryLap,
      telemetry.comparisonEnabled,
      telemetry.primaryTelemetry,
      telemetry.secondaryTelemetry,
      weather.data?.weather,
    ],
  )

  useEffect(() => {
    setSelectedTelemetryIndex(0)
    setIsPlaying(false)
  }, [telemetry.primaryTelemetry])

  useEffect(() => {
    setSelectedCornerNumber(null)
  }, [corners.data])

  useEffect(() => {
    onEngineeringRailChange({
      circuitPoints: circuit.data?.points,
      corners: corners.data?.corners,
      driver: selectedDriver,
      lap: selectedLap,
      selectedCornerNumber,
      selectedTelemetryIndex,
      selection: discovery.selection,
      telemetry: telemetry.primaryTelemetry,
    })
  }, [
    circuit.data?.points,
    corners.data?.corners,
    discovery.selection,
    onEngineeringRailChange,
    selectedCornerNumber,
    selectedDriver,
    selectedLap,
    selectedTelemetryIndex,
    telemetry.primaryTelemetry,
  ])

  useEffect(() => {
    if (nearestCornerTelemetryIndex !== null) {
      setSelectedTelemetryIndex(nearestCornerTelemetryIndex)
    }
  }, [nearestCornerTelemetryIndex])

  useEffect(() => {
    const sampleCount = telemetry.primaryTelemetry?.length ?? 0
    if (!isPlaying || sampleCount === 0) {
      return undefined
    }

    const frameInterval = 1000 / (15 * playbackSpeed)
    const finalIndex = sampleCount - 1

    const advance = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp
      }

      if (timestamp - lastFrameTimeRef.current >= frameInterval) {
        lastFrameTimeRef.current = timestamp
        setSelectedTelemetryIndex((currentIndex) => {
          if (currentIndex >= finalIndex) {
            setIsPlaying(false)
            return finalIndex
          }

          const nextIndex = currentIndex + 1
          if (nextIndex === finalIndex) {
            setIsPlaying(false)
          }
          return nextIndex
        })
      }

      animationFrameRef.current = window.requestAnimationFrame(advance)
    }

    lastFrameTimeRef.current = null
    animationFrameRef.current = window.requestAnimationFrame(advance)

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      lastFrameTimeRef.current = null
    }
  }, [isPlaying, playbackSpeed, telemetry.primaryTelemetry?.length])

  const sampleCount = telemetry.primaryTelemetry?.length ?? 0
  const handlePlayPause = () => {
    if (sampleCount === 0 || selectedTelemetryIndex >= sampleCount - 1) {
      return
    }
    setIsPlaying((current) => !current)
  }
  const handleStepBack = () => {
    setIsPlaying(false)
    setSelectedTelemetryIndex((current) => Math.max(current - 1, 0))
  }
  const handleStepForward = () => {
    setIsPlaying(false)
    setSelectedTelemetryIndex((current) => Math.min(current + 1, Math.max(sampleCount - 1, 0)))
  }
  const handleRestart = () => {
    setIsPlaying(false)
    setSelectedTelemetryIndex(0)
  }

  return (
    <>
      <TopBar exportControl={<ExportButton reportState={reportState} />} />
      <main className="min-w-0 overflow-y-auto px-[var(--space-md)] py-[var(--space-md)] sm:px-[var(--space-lg)] sm:py-[var(--space-lg)] lg:px-[var(--space-xl)] lg:py-[var(--space-xl)]">
        <div className="grid gap-[var(--space-md)] lg:grid-cols-12">
          {activeView === 'dashboard' && <SessionSelector discovery={discovery} secondaryDiscovery={secondaryDiscovery} />}
        {activeView === 'driver-comparison' && <DriverComparisonPanel
          comparisonEnabled={telemetry.comparisonEnabled}
          primaryDriver={selectedDriver}
          primaryLap={selectedLap}
          primaryTelemetry={telemetry.primaryTelemetry}
          secondaryDriver={selectedSecondaryDriver}
          secondaryLap={selectedSecondaryLap}
          secondaryTelemetry={telemetry.secondaryTelemetry}
        />}
        {activeView === 'circuit-analysis' && <CircuitView
          circuit={circuit.data}
          circuitError={circuit.error}
          isCircuitLoading={circuit.isLoading}
          corners={corners.data?.corners}
          telemetry={telemetry.primaryTelemetry}
          selectedTelemetryIndex={selectedTelemetryIndex}
          selectedCornerNumber={selectedCornerNumber}
        />}
        {activeView === 'lap-analysis' && <LapAnalysisPanel lap={selectedLap} telemetry={telemetry.primaryTelemetry} />}
        {activeView === 'sector-analysis' && <SectorAnalysisPanel
          comparisonEnabled={telemetry.comparisonEnabled}
          primaryLap={selectedLap}
          secondaryLap={selectedSecondaryLap}
        />}
        {activeView === 'corner-analysis' && <>
        <CornerAnalysisPanel
          corners={corners.data?.corners}
          error={corners.error}
          isLoading={corners.isLoading}
          selectedCornerNumber={selectedCornerNumber}
          onCornerSelect={setSelectedCornerNumber}
        />
        <CornerMetricsPanel
          corner={selectedCorner}
          telemetry={telemetry.primaryTelemetry}
        />
        </>}
        {activeView === 'brake-comparison' && <BrakeComparisonPanel
          comparisonEnabled={telemetry.comparisonEnabled}
          corner={selectedCorner}
          primaryTelemetry={telemetry.primaryTelemetry}
          secondaryTelemetry={telemetry.secondaryTelemetry}
        />}
        {activeView === 'engineering-insights' && <EngineeringInsightsPanel insights={insights} />}
        {activeView === 'weather' && <WeatherPanel weather={weather.data?.weather} error={weather.error} isLoading={weather.isLoading} />}
        {activeView === 'circuit-information' && <CircuitInformationPanel
          circuit={circuitInformation.data?.circuit}
          error={circuitInformation.error}
          isLoading={circuitInformation.isLoading}
        />}
        {activeView === 'telemetry' && <>
        <DriverHUD
          telemetry={telemetry.primaryTelemetry}
          selectedTelemetryIndex={selectedTelemetryIndex}
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
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          onPlayPause={handlePlayPause}
          onStepBack={handleStepBack}
          onStepForward={handleStepForward}
          onRestart={handleRestart}
          onPlaybackSpeedChange={setPlaybackSpeed}
        />
        </>}
        {activeView === 'reports' && (
          <section aria-labelledby="reports-workspace-title" className="flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-12">
            <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
              <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">System 8A</p>
              <h2 id="reports-workspace-title" className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]">Session Reports</h2>
            </div>
            <div className="mt-[var(--space-lg)] border-t border-[var(--color-border)] pt-[var(--space-lg)]">
              <p className="text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">Export the current loaded workspace state without requesting additional data.</p>
              <div className="mt-[var(--space-md)]"><ExportButton reportState={reportState} /></div>
            </div>
          </section>
        )}
        </div>
      </main>
    </>
  )
}
