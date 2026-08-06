import { createContext, type Dispatch, type SetStateAction } from 'react'

export interface DashboardSelection {
  season: number | null
  event: string | null
  session: string | null
  driver: string | null
  lap: number | null
}

export const EMPTY_SELECTION: DashboardSelection = {
  season: null,
  event: null,
  session: null,
  driver: null,
  lap: null,
}

export interface DashboardComparisonContextValue {
  primarySelection: DashboardSelection
  secondarySelection: DashboardSelection
  comparisonEnabled: boolean
  setPrimarySelection: Dispatch<SetStateAction<DashboardSelection>>
  setSecondarySelection: (selection: SetStateAction<DashboardSelection>) => void
  setComparisonEnabled: Dispatch<SetStateAction<boolean>>
}

export const DashboardComparisonContext = createContext<DashboardComparisonContextValue | null>(null)
