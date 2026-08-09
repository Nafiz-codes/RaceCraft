export interface CircuitRegistryEntry {
  /** Stable RaceCraft circuit identifier; never derived from a display label. */
  id: string
  name: string
  country: string
  calendarRound: number
  officialCornerCount: number
  clockwise: boolean
  length: string
  city: string
  layoutAsset?: string
  firstGrandPrix?: number
}

const circuitAssets = import.meta.glob('../assets/circuits/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const circuit = (id: string, name: string, country: string, round: number, corners: number, length: string, city: string, firstGrandPrix?: number): CircuitRegistryEntry => ({
  id, name, country, calendarRound: round, officialCornerCount: corners, clockwise: true, length, city, layoutAsset: circuitAssets[`../assets/circuits/${id}.png`], firstGrandPrix,
})

export const circuitRegistry: readonly CircuitRegistryEntry[] = [
  circuit('australian', 'Australian Grand Prix', 'Australia', 1, 14, '5.278 km', 'Melbourne', 1996),
  circuit('chinese', 'Chinese Grand Prix', 'China', 2, 16, '5.451 km', 'Shanghai', 2004),
  circuit('japanese', 'Japanese Grand Prix', 'Japan', 3, 18, '5.807 km', 'Suzuka', 1987),
  circuit('bahrain', 'Bahrain Grand Prix', 'Bahrain', 4, 15, '5.412 km', 'Sakhir', 2004),
  circuit('saudiarabian', 'Saudi Arabian Grand Prix', 'Saudi Arabia', 5, 27, '6.174 km', 'Jeddah', 2021),
  circuit('miami', 'Miami Grand Prix', 'United States', 6, 19, '5.412 km', 'Miami', 2022),
  circuit('canadian', 'Canadian Grand Prix', 'Canada', 7, 14, '4.361 km', 'Montreal', 1978),
  circuit('monaco', 'Monaco Grand Prix', 'Monaco', 8, 19, '3.337 km', 'Monte Carlo', 1950),
  circuit('spanish', 'Spanish Grand Prix', 'Spain', 9, 14, '4.657 km', 'Barcelona', 1991),
  circuit('austrian', 'Austrian Grand Prix', 'Austria', 10, 10, '4.318 km', 'Spielberg', 1970),
  circuit('british', 'British Grand Prix', 'United Kingdom', 11, 18, '5.891 km', 'Silverstone', 1950),
  circuit('belgian', 'Belgian Grand Prix', 'Belgium', 12, 19, '7.004 km', 'Spa-Francorchamps', 1950),
  circuit('hungarian', 'Hungarian Grand Prix', 'Hungary', 13, 14, '4.381 km', 'Budapest', 1986),
  circuit('dutch', 'Dutch Grand Prix', 'Netherlands', 14, 14, '4.259 km', 'Zandvoort', 1952),
  circuit('italian', 'Italian Grand Prix', 'Italy', 15, 11, '5.793 km', 'Monza', 1950),
  circuit('madrid', 'Spanish Grand Prix', 'Spain', 16, 22, '5.474 km', 'Madrid', 2026),
  circuit('azerbaijan', 'Azerbaijan Grand Prix', 'Azerbaijan', 17, 20, '6.003 km', 'Baku', 2016),
  circuit('singapore', 'Singapore Grand Prix', 'Singapore', 18, 19, '4.940 km', 'Singapore', 2008),
  circuit('unitedstates', 'United States Grand Prix', 'United States', 19, 20, '5.513 km', 'Austin', 2012),
  circuit('mexicocity', 'Mexico City Grand Prix', 'Mexico', 20, 17, '4.304 km', 'Mexico City', 1963),
  circuit('saopaulo', 'São Paulo Grand Prix', 'Brazil', 21, 15, '4.309 km', 'São Paulo', 1973),
  circuit('lasvegas', 'Las Vegas Grand Prix', 'United States', 22, 17, '6.201 km', 'Las Vegas', 2023),
  circuit('qatar', 'Qatar Grand Prix', 'Qatar', 23, 16, '5.419 km', 'Lusail', 2021),
  circuit('abudhabi', 'Abu Dhabi Grand Prix', 'United Arab Emirates', 24, 16, '5.281 km', 'Abu Dhabi', 2009),
]

export function getCircuitByName(name: string | null | undefined): CircuitRegistryEntry | undefined {
  return name ? circuitRegistry.find((circuitEntry) => circuitEntry.name.toLowerCase() === name.trim().toLowerCase()) : undefined
}

export function getCircuitByRound(round: number): CircuitRegistryEntry | undefined {
  return circuitRegistry.find((circuitEntry) => circuitEntry.calendarRound === round)
}

export function getCircuitsByCountry(country: string | null | undefined): CircuitRegistryEntry[] {
  return country ? circuitRegistry.filter((circuitEntry) => circuitEntry.country.toLowerCase() === country.trim().toLowerCase()) : []
}
