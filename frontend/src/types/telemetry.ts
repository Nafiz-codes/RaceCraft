export interface TelemetryModel {
  time: string
  distance: number
  speed: number
  throttle: number
  brake: boolean
  rpm: number
  gear: number
  drs: number
  x: number
  y: number
  z: number
}

export interface TelemetryPayload {
  telemetry: TelemetryModel[]
}
