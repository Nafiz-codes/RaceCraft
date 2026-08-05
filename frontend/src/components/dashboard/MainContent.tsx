import type { ReactNode } from 'react'

interface DashboardModule {
  id: string
  system: string
  title: string
  description: string
  className?: string
}

function DashboardModulePanel({ module }: { module: DashboardModule }): ReactNode {
  return (
    <section
      id={module.id}
      aria-labelledby={`${module.id}-title`}
      className={`flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] ${module.className ?? ''}`}
    >
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">
          {module.system}
        </p>
        <h2
          id={`${module.id}-title`}
          className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]"
        >
          {module.title}
        </h2>
      </div>

      <div className="mt-auto border-t border-[var(--color-border)] pt-[var(--space-lg)]">
        <p className="max-w-md text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
          {module.description}
        </p>
      </div>
    </section>
  )
}

export default function MainContent(): ReactNode {
  return (
    <main className="min-w-0 overflow-y-auto px-[var(--space-md)] py-[var(--space-md)] sm:px-[var(--space-lg)] sm:py-[var(--space-lg)] lg:px-[var(--space-xl)] lg:py-[var(--space-xl)]">
      <div className="grid gap-[var(--space-md)] lg:grid-cols-12">
        <DashboardModulePanel
          module={{
            id: 'session-selector',
            system: 'System 1A',
            title: 'Session Selector',
            description: 'Choose a season, event, and session to initialize the workspace.',
            className: 'lg:col-span-8',
          }}
        />
        <DashboardModulePanel
          module={{
            id: 'driver-comparison-module',
            system: 'System 2B',
            title: 'Driver Comparison',
            description: 'Configure the drivers and laps that will be compared.',
            className: 'lg:col-span-4',
          }}
        />
        <DashboardModulePanel
          module={{
            id: 'circuit-view',
            system: 'System 3C',
            title: 'Circuit View',
            description: 'Circuit context will be available once a session is loaded.',
            className: 'min-h-[26rem] lg:col-span-8 lg:row-span-2',
          }}
        />
        <DashboardModulePanel
          module={{
            id: 'lap-analysis',
            system: 'System 4D',
            title: 'Lap Analysis',
            description: 'Lap and sector context will appear for the selected reference.',
            className: 'lg:col-span-4',
          }}
        />
        <DashboardModulePanel
          module={{
            id: 'weather-module',
            system: 'System 5E',
            title: 'Weather',
            description: 'Track and atmospheric conditions will appear with session data.',
            className: 'lg:col-span-4',
          }}
        />
        <DashboardModulePanel
          module={{
            id: 'telemetry-module',
            system: 'System 6F',
            title: 'Telemetry',
            description: 'Telemetry channels will be staged here after a driver lap is selected.',
            className: 'min-h-44 lg:col-span-12',
          }}
        />
      </div>
    </main>
  )
}
