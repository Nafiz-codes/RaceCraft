export interface CircuitRegistryEntry {
  id: string
  name: string
  country: string
  countryFlag: string
  layoutAsset: string
  heroImage: string
  calendarRound: number
  officialCornerCount: number
  clockwise: boolean
  length: string
  city: string
  firstGrandPrix?: number
}

const circuit = (id: string, name: string, country: string, flag: string, round: number, corners: number, length: string, city: string, firstGrandPrix?: number): CircuitRegistryEntry => ({
  id, name, country, countryFlag: `/flags/${flag}.svg`, layoutAsset: `/circuits/${id}.svg`, heroImage: `/circuits/${id}.jpg`, calendarRound: round, officialCornerCount: corners, clockwise: true, length, city, firstGrandPrix,
})

export const circuitRegistry: readonly CircuitRegistryEntry[] = [
  circuit('australian-grand-prix', 'Australian Grand Prix', 'Australia', 'au', 1, 14, '5.278 km', 'Melbourne', 1996),
  circuit('chinese-grand-prix', 'Chinese Grand Prix', 'China', 'cn', 2, 16, '5.451 km', 'Shanghai', 2004),
  circuit('japanese-grand-prix', 'Japanese Grand Prix', 'Japan', 'jp', 3, 18, '5.807 km', 'Suzuka', 1987),
  circuit('bahrain-grand-prix', 'Bahrain Grand Prix', 'Bahrain', 'bh', 4, 15, '5.412 km', 'Sakhir', 2004),
  circuit('saudi-arabian-grand-prix', 'Saudi Arabian Grand Prix', 'Saudi Arabia', 'sa', 5, 27, '6.174 km', 'Jeddah', 2021),
  circuit('miami-grand-prix', 'Miami Grand Prix', 'United States', 'us', 6, 19, '5.412 km', 'Miami', 2022),
  circuit('canadian-grand-prix', 'Canadian Grand Prix', 'Canada', 'ca', 7, 14, '4.361 km', 'Montreal', 1978),
  circuit('monaco-grand-prix', 'Monaco Grand Prix', 'Monaco', 'mc', 8, 19, '3.337 km', 'Monte Carlo', 1950),
  circuit('spanish-grand-prix', 'Spanish Grand Prix', 'Spain', 'es', 9, 14, '4.657 km', 'Barcelona', 1991),
  circuit('austrian-grand-prix', 'Austrian Grand Prix', 'Austria', 'at', 10, 10, '4.318 km', 'Spielberg', 1970),
  circuit('british-grand-prix', 'British Grand Prix', 'United Kingdom', 'gb', 11, 18, '5.891 km', 'Silverstone', 1950),
  circuit('belgian-grand-prix', 'Belgian Grand Prix', 'Belgium', 'be', 12, 19, '7.004 km', 'Spa-Francorchamps', 1950),
  circuit('hungarian-grand-prix', 'Hungary Grand Prix', 'Hungary', 'hu', 13, 14, '4.381 km', 'Budapest', 1986),
  circuit('dutch-grand-prix', 'Dutch Grand Prix', 'Netherlands', 'nl', 14, 14, '4.259 km', 'Zandvoort', 1952),
  circuit('italian-grand-prix', 'Italian Grand Prix', 'Italy', 'it', 15, 11, '5.793 km', 'Monza', 1950),
  circuit('madrid-grand-prix', 'Spanish Grand Prix', 'Spain', 'es', 16, 22, '5.474 km', 'Madrid', 2026),
  circuit('azerbaijan-grand-prix', 'Azerbaijan Grand Prix', 'Azerbaijan', 'az', 17, 20, '6.003 km', 'Baku', 2016),
  circuit('singapore-grand-prix', 'Singapore Grand Prix', 'Singapore', 'sg', 18, 19, '4.940 km', 'Singapore', 2008),
  circuit('united-states-grand-prix', 'United States Grand Prix', 'United States', 'us', 19, 20, '5.513 km', 'Austin', 2012),
  circuit('mexico-city-grand-prix', 'Mexico City Grand Prix', 'Mexico', 'mx', 20, 17, '4.304 km', 'Mexico City', 1963),
  circuit('sao-paulo-grand-prix', 'São Paulo Grand Prix', 'Brazil', 'br', 21, 15, '4.309 km', 'São Paulo', 1973),
  circuit('las-vegas-grand-prix', 'Las Vegas Grand Prix', 'United States', 'us', 22, 17, '6.201 km', 'Las Vegas', 2023),
  circuit('qatar-grand-prix', 'Qatar Grand Prix', 'Qatar', 'qa', 23, 16, '5.419 km', 'Lusail', 2021),
  circuit('abu-dhabi-grand-prix', 'Abu Dhabi Grand Prix', 'United Arab Emirates', 'ae', 24, 16, '5.281 km', 'Abu Dhabi', 2009),
]

export function getCircuitByName(name: string | null | undefined): CircuitRegistryEntry | undefined {
  return name ? circuitRegistry.find((circuit) => circuit.name.toLowerCase() === name.trim().toLowerCase()) : undefined
}
export function getCircuitByRound(round: number): CircuitRegistryEntry | undefined { return circuitRegistry.find((circuit) => circuit.calendarRound === round) }
export function getCircuitsByCountry(country: string | null | undefined): CircuitRegistryEntry[] { return country ? circuitRegistry.filter((circuit) => circuit.country.toLowerCase() === country.trim().toLowerCase()) : [] }
