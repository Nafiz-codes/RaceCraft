export interface CircuitCorner {
  cornerNumber: number
  cornerLetter: string | null
  cornerAngle: number | null
  x: number
  y: number
  distance: number | null
}

export interface CornersPayload {
  corners: CircuitCorner[]
}
