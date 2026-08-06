export interface SessionWeather {
  airTemperature: number
  trackTemperature: number
  humidity: number
  windSpeed: number
  windDirection: number
  pressure: number
  rainfall: boolean
}

export interface WeatherPayload {
  weather: SessionWeather
}
