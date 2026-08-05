export interface Season {
  year: number
}

export interface Event {
  round: number
  eventName: string
  country: string
  location: string
  date: string | null
}

export interface Session {
  sessionKey: string
  sessionName: string
  date: string | null
}

export interface Driver {
  driverNumber: string
  abbreviation: string
  broadcastName: string
  fullName: string
  teamName: string
  teamColor: string | null
  countryCode: string | null
  headshotUrl: string | null
}

export interface Lap {
  lapNumber: number
  lapTime: string | null
  tyreCompound: string | null
  tyreLife: number | null
  isPersonalBest: boolean
  isAccurate: boolean
  pitOutLap: boolean
  pitInLap: boolean
}

export interface SeasonsPayload {
  seasons: Season[]
}

export interface EventsPayload {
  events: Event[]
}

export interface SessionsPayload {
  sessions: Session[]
}

export interface DriversPayload {
  drivers: Driver[]
}

export interface LapsPayload {
  laps: Lap[]
}
