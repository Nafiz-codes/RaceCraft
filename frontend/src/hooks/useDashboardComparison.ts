import { useContext } from 'react'

import {
  DashboardComparisonContext,
  type DashboardComparisonContextValue,
} from '@/contexts/dashboardComparisonStore'

export default function useDashboardComparison(): DashboardComparisonContextValue {
  const context = useContext(DashboardComparisonContext)
  if (!context) {
    throw new Error('useDashboardComparison must be used within DashboardComparisonProvider.')
  }

  return context
}
