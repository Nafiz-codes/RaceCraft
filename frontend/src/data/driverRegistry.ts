export interface DriverCareerProfile {
  wins?: number
  podiums?: number
  championships?: number
  birthDate?: string
  debut?: string
}

export interface DriverRegistryEntry extends DriverCareerProfile {
  id: string
  fullName: string
  shortName: string
  abbreviation: string
  driverNumber: string
  team: string
  country: string
  flagAsset: string
  portraitAsset: string | null
  constructorLogo: string
  accentColor: string
  teamColor: string
  helmetColor?: string
  currentDriver: boolean
}

const portraitAssets = import.meta.glob('../assets/drivers/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const asset = {
  driver: (lastName: string) => portraitAssets[`../assets/drivers/${lastName.toLocaleLowerCase()}.png`] ?? null,
  flag: (country: string) => `/flags/${country}.svg`,
  team: (team: string) => `/teams/${team}.svg`,
}

const registry = [
  ['george-russell', 'George Russell', 'Russell', 'RUS', '63', 'Mercedes', 'United Kingdom', 'gb', 'mercedes', '--team-mercedes'],
  ['kimi-antonelli', 'Kimi Antonelli', 'Antonelli', 'ANT', '12', 'Mercedes', 'Italy', 'it', 'mercedes', '--team-mercedes'],
  ['charles-leclerc', 'Charles Leclerc', 'Leclerc', 'LEC', '16', 'Ferrari', 'Monaco', 'mc', 'ferrari', '--team-ferrari'],
  ['lewis-hamilton', 'Lewis Hamilton', 'Hamilton', 'HAM', '44', 'Ferrari', 'United Kingdom', 'gb', 'ferrari', '--team-ferrari'],
  ['lando-norris', 'Lando Norris', 'Norris', 'NOR', '1', 'McLaren', 'United Kingdom', 'gb', 'mclaren', '--team-mclaren'],
  ['oscar-piastri', 'Oscar Piastri', 'Piastri', 'PIA', '81', 'McLaren', 'Australia', 'au', 'mclaren', '--team-mclaren'],
  ['max-verstappen', 'Max Verstappen', 'Verstappen', 'VER', '3', 'Red Bull Racing', 'Netherlands', 'nl', 'red_bull', '--team-red-bull'],
  ['isack-hadjar', 'Isack Hadjar', 'Hadjar', 'HAD', '6', 'Red Bull Racing', 'France', 'fr', 'red_bull', '--team-red-bull'],
  ['liam-lawson', 'Liam Lawson', 'Lawson', 'LAW', '30', 'Racing Bulls', 'New Zealand', 'nz', 'racing_bulls', '--team-rb'],
  ['arvid-lindblad', 'Arvid Lindblad', 'Lindblad', 'LIN', '41', 'Racing Bulls', 'United Kingdom', 'gb', 'racing_bulls', '--team-rb'],
  ['pierre-gasly', 'Pierre Gasly', 'Gasly', 'GAS', '10', 'Alpine', 'France', 'fr', 'alpine', '--team-alpine'],
  ['franco-colapinto', 'Franco Colapinto', 'Colapinto', 'COL', '43', 'Alpine', 'Argentina', 'ar', 'alpine', '--team-alpine'],
  ['esteban-ocon', 'Esteban Ocon', 'Ocon', 'OCO', '31', 'Haas F1 Team', 'France', 'fr', 'haas', '--team-haas'],
  ['oliver-bearman', 'Oliver Bearman', 'Bearman', 'BEA', '87', 'Haas F1 Team', 'United Kingdom', 'gb', 'haas', '--team-haas'],
  ['nico-hulkenberg', 'Nico Hulkenberg', 'Hulkenberg', 'HUL', '27', 'Audi', 'Germany', 'de', 'audi', '--team-audi'],
  ['gabriel-bortoleto', 'Gabriel Bortoleto', 'Bortoleto', 'BOR', '5', 'Audi', 'Brazil', 'br', 'audi', '--team-audi'],
  ['carlos-sainz', 'Carlos Sainz', 'Sainz', 'SAI', '55', 'Williams', 'Spain', 'es', 'williams', '--team-williams'],
  ['alexander-albon', 'Alexander Albon', 'Albon', 'ALB', '23', 'Williams', 'Thailand', 'th', 'williams', '--team-williams'],
  ['fernando-alonso', 'Fernando Alonso', 'Alonso', 'ALO', '14', 'Aston Martin', 'Spain', 'es', 'aston_martin', '--team-aston-martin'],
  ['lance-stroll', 'Lance Stroll', 'Stroll', 'STR', '18', 'Aston Martin', 'Canada', 'ca', 'aston_martin', '--team-aston-martin'],
  ['sergio-perez', 'Sergio Perez', 'Perez', 'PER', '11', 'Cadillac', 'Mexico', 'mx', 'cadillac', '--team-cadillac'],
  ['valtteri-bottas', 'Valtteri Bottas', 'Bottas', 'BOT', '77', 'Cadillac', 'Finland', 'fi', 'cadillac', '--team-cadillac'],
] as const

export const driverRegistry: readonly DriverRegistryEntry[] = registry.map(([
  id,
  fullName,
  shortName,
  abbreviation,
  driverNumber,
  team,
  country,
  flag,
  teamAsset,
  teamColor,
]) => ({
  id,
  fullName,
  shortName,
  abbreviation,
  driverNumber,
  team,
  country,
  flagAsset: asset.flag(flag),
  portraitAsset: asset.driver(shortName),
  constructorLogo: asset.team(teamAsset),
  accentColor: `var(${teamColor})`,
  teamColor: `var(${teamColor})`,
  currentDriver: true,
}))

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase()
}

export function getDriverByName(name: string | null | undefined): DriverRegistryEntry | undefined {
  if (!name) return undefined
  const normalized = normalize(name)
  return driverRegistry.find((driver) =>
    normalize(driver.fullName) === normalized || normalize(driver.shortName) === normalized,
  )
}

export function getDriverByAbbreviation(abbreviation: string | null | undefined): DriverRegistryEntry | undefined {
  if (!abbreviation) return undefined
  return driverRegistry.find((driver) => driver.abbreviation === abbreviation.trim().toUpperCase())
}

export function getDriverByNumber(driverNumber: string | number | null | undefined): DriverRegistryEntry | undefined {
  if (driverNumber === null || driverNumber === undefined) return undefined
  return driverRegistry.find((driver) => driver.driverNumber === String(driverNumber))
}

export function getDriversByTeam(team: string | null | undefined): DriverRegistryEntry[] {
  if (!team) return []
  const normalized = normalize(team)
  return driverRegistry.filter((driver) => normalize(driver.team) === normalized)
}
