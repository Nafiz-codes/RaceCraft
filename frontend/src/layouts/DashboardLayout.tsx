import MainContent from '@/components/dashboard/MainContent'
import EngineeringRail, { type EngineeringRailState } from '@/components/dashboard/EngineeringRail'
import Sidebar, { type DashboardView } from '@/components/dashboard/Sidebar'
import { DashboardComparisonProvider } from '@/contexts/DashboardComparisonContext'
import { useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function DashboardLayout(): ReactNode {
  const [activeView, setActiveView] = useState<DashboardView>('dashboard')
  const [engineeringRail, setEngineeringRail] = useState<EngineeringRailState | null>(null)
  const [searchParams] = useSearchParams()
  const initialDriverAbbreviation = searchParams.get('driver')
  const initialCircuitName = searchParams.get('circuit')

  return (
    <DashboardComparisonProvider>
      <div className="min-h-svh bg-[var(--color-background)] text-[var(--color-text-primary)] lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] xl:h-svh xl:grid-cols-[17.5rem_minmax(0,1fr)_23rem] xl:overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex min-w-0 flex-col xl:min-h-0">
          <MainContent activeView={activeView} initialCircuitName={initialCircuitName} initialDriverAbbreviation={initialDriverAbbreviation} onEngineeringRailChange={setEngineeringRail} />
        </div>
        <EngineeringRail state={engineeringRail} />
      </div>
    </DashboardComparisonProvider>
  )
}
