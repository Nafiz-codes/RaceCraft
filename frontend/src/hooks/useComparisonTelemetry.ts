import useDashboardComparison from '@/hooks/useDashboardComparison'
import useTelemetry from '@/hooks/useTelemetry'

export default function useComparisonTelemetry() {
  const { comparisonEnabled, primarySelection, secondarySelection } = useDashboardComparison()
  const primary = useTelemetry(primarySelection)
  const secondary = useTelemetry(secondarySelection, comparisonEnabled)

  return {
    comparisonEnabled,
    primaryTelemetry: primary.data?.telemetry,
    secondaryTelemetry: secondary.data?.telemetry,
    primaryError: primary.error,
    secondaryError: secondary.error,
    primaryLoading: primary.isLoading,
    secondaryLoading: secondary.isLoading,
  }
}
