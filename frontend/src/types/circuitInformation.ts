export interface CircuitInformation {
  circuitName: string | null
  eventName: string | null
  country: string | null
  location: string | null
  circuitLength: number | null
  numberOfCorners: number | null
  sessionName: string | null
  eventDate: string | null
}

export interface CircuitInformationPayload {
  circuit: CircuitInformation
}
