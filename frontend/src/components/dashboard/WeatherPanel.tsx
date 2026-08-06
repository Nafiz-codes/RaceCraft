import type { ReactNode } from 'react'

import type { SessionWeather } from '@/types/weather'

interface WeatherPanelProps {
  weather: SessionWeather | undefined
  error: string | null
  isLoading: boolean
}

function WeatherMetric({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div className="border border-[var(--color-border)] p-[var(--space-sm)]">
      <dt className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{label}</dt>
      <dd className="mt-1 [font-family:var(--font-family-mono)] text-[var(--font-size-small)] text-[var(--color-text-primary)]">{value}</dd>
    </div>
  )
}

export default function WeatherPanel({ weather, error, isLoading }: WeatherPanelProps): ReactNode {
  let content: ReactNode = (
    <p className="text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">Select a primary session to load recorded weather.</p>
  )

  if (isLoading) {
    content = <p className="text-[var(--font-size-small)] text-[var(--color-text-secondary)]">Loading weather...</p>
  } else if (error) {
    content = <p className="text-[var(--font-size-small)] text-[var(--color-error)]">{error}</p>
  } else if (weather) {
    content = (
      <dl className="grid grid-cols-2 gap-[var(--space-sm)]">
        <WeatherMetric label="Air Temperature" value={`${weather.airTemperature} °C`} />
        <WeatherMetric label="Track Temperature" value={`${weather.trackTemperature} °C`} />
        <WeatherMetric label="Humidity" value={`${weather.humidity}%`} />
        <WeatherMetric label="Wind Speed" value={`${weather.windSpeed} m/s`} />
        <WeatherMetric label="Wind Direction" value={`${weather.windDirection}°`} />
        <WeatherMetric label="Pressure" value={`${weather.pressure} hPa`} />
        <WeatherMetric label="Rain Status" value={weather.rainfall ? 'Rain' : 'No Rain'} />
      </dl>
    )
  }

  return (
    <section id="weather-module" aria-labelledby="weather-module-title" className="flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-4">
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">System 5E</p>
        <h2 id="weather-module-title" className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]">Weather</h2>
      </div>
      <div className="mt-[var(--space-lg)] border-t border-[var(--color-border)] pt-[var(--space-lg)]">{content}</div>
    </section>
  )
}
