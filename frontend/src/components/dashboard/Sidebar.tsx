import type { ReactNode } from 'react'
import RaceCraftLogo from '@/components/branding/RaceCraftLogo'

export type DashboardView =
  | 'dashboard'
  | 'telemetry'
  | 'driver-comparison'
  | 'circuit-analysis'
  | 'lap-analysis'
  | 'sector-analysis'
  | 'corner-analysis'
  | 'brake-comparison'
  | 'engineering-insights'
  | 'weather'
  | 'circuit-information'
  | 'reports'

interface SidebarProps {
  activeView: DashboardView
  onViewChange: (view: DashboardView) => void
}

const navigationItems: { label: string; view: DashboardView }[] = [
  { label: 'Dashboard', view: 'dashboard' },
  { label: 'Telemetry', view: 'telemetry' },
  { label: 'Driver Comparison', view: 'driver-comparison' },
  { label: 'Circuit Analysis', view: 'circuit-analysis' },
  { label: 'Lap Analysis', view: 'lap-analysis' },
  { label: 'Sector Analysis', view: 'sector-analysis' },
  { label: 'Corner Analysis', view: 'corner-analysis' },
  { label: 'Brake Comparison', view: 'brake-comparison' },
  { label: 'Engineering Insights', view: 'engineering-insights' },
  { label: 'Weather', view: 'weather' },
  { label: 'Circuit Information', view: 'circuit-information' },
  { label: 'Reports', view: 'reports' },
]

export default function Sidebar({ activeView, onViewChange }: SidebarProps): ReactNode {
  return (
    <aside className="hidden min-h-svh border-r border-[var(--color-border)] bg-[var(--color-background-secondary)] p-[var(--space-md)] lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
      <div className="mb-[var(--space-xl)] px-[var(--space-md)] py-[var(--space-lg)]">
        <RaceCraftLogo className="h-8 w-[9.4rem]" />
        <p className="mt-[var(--space-sm)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Analysis Core
        </p>
      </div>

      <p className="px-[var(--space-md)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        Workspace
      </p>
      <nav aria-label="Dashboard workspaces" className="mt-[var(--space-sm)] flex min-h-0 flex-1 flex-col gap-[calc(var(--space-sm)/2)] overflow-y-auto">
        {navigationItems.map((item, index) => {
          const isActive = item.view === activeView
          return (
            <button
              key={item.view}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onViewChange(item.view)}
              className={`flex items-center gap-[var(--space-md)] border-r-2 px-[var(--space-md)] py-[var(--space-sm)] text-left text-[var(--font-size-small)] font-[var(--font-weight-medium)] transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[var(--color-primary-purple)] ${isActive ? 'border-[var(--color-primary-purple)] bg-[var(--color-surface)] text-[var(--color-text-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-primary-purple)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'}`}
            >
              <span aria-hidden="true" className="w-5 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] text-[var(--color-text-muted)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-[var(--space-md)] border-t border-[var(--color-border)] px-[var(--space-md)] py-[var(--space-lg)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          Workspace ready
        </p>
      </div>
    </aside>
  )
}
