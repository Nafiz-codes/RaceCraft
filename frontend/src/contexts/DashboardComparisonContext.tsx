import {
  type ReactNode,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react'

import {
  DashboardComparisonContext,
  EMPTY_SELECTION,
  type DashboardSelection,
} from '@/contexts/dashboardComparisonStore'

export function DashboardComparisonProvider({ children }: { children: ReactNode }) {
  const [primarySelection, setPrimarySelection] = useState<DashboardSelection>(EMPTY_SELECTION)
  const [secondarySelection, setSecondarySelectionState] = useState<DashboardSelection>(EMPTY_SELECTION)
  const [comparisonEnabled, setComparisonEnabled] = useState(false)

  const setSecondarySelection = useCallback(
    (selection: SetStateAction<DashboardSelection>) => {
      if (comparisonEnabled) {
        setSecondarySelectionState(selection)
      }
    },
    [comparisonEnabled],
  )

  const value = useMemo(
    () => ({
      primarySelection,
      secondarySelection,
      comparisonEnabled,
      setPrimarySelection,
      setSecondarySelection,
      setComparisonEnabled,
    }),
    [comparisonEnabled, primarySelection, secondarySelection, setSecondarySelection],
  )

  return (
    <DashboardComparisonContext.Provider value={value}>
      {children}
    </DashboardComparisonContext.Provider>
  )
}
