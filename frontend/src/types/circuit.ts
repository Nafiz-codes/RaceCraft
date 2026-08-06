export interface CircuitPointModel {
  x: number
  y: number
  distance: number
}

export interface CircuitPayload {
  points: CircuitPointModel[]
}
