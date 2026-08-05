import type { ReactNode } from 'react'

const navigationItems = [
  { href: '#session-selector', label: 'Session Selector' },
  { href: '#driver-comparison-module', label: 'Driver Comparison' },
  { href: '#telemetry-module', label: 'Telemetry' },
  { href: '#lap-analysis', label: 'Lap Analysis' },
  { href: '#circuit-view', label: 'Circuit View' },
  { href: '#weather-module', label: 'Weather' },
] as const

export default function Sidebar(): ReactNode {
  return (
    <aside className="hidden min-h-svh border-r border-[var(--color-border)] bg-[var(--color-background-secondary)] p-[var(--space-md)] lg:flex lg:flex-col">
      <div className="mb-[var(--space-xl)] px-[var(--space-md)] py-[var(--space-lg)]">
        <p className="text-[var(--font-size-heading-4)] font-[var(--font-weight-semibold)] tracking-[-0.03em] text-[var(--color-text-primary)]">
          SYSTEM
        </p>
        <p className="mt-[var(--space-sm)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Analysis Core
        </p>
      </div>

      <nav aria-label="Dashboard modules" className="flex flex-col gap-[calc(var(--space-sm)/2)]">
        {navigationItems.map((item, index) => (
          <a
            key={item.href}
            aria-current={index === 0 ? 'page' : undefined}
            href={item.href}
            className={`flex items-center gap-[var(--space-md)] border-r-2 px-[var(--space-md)] py-[var(--space-md)] text-[var(--font-size-small)] font-[var(--font-weight-medium)] transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] ${
              index === 0
                ? 'border-[var(--color-primary-purple)] bg-[var(--color-surface)] text-[var(--color-text-primary)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-primary-purple)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] focus-visible:border-[var(--color-primary-purple)] focus-visible:bg-[var(--color-surface)] focus-visible:text-[var(--color-text-primary)]'
            }`}
          >
            <span className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] text-[var(--color-text-muted)]">
              0{index + 1}
            </span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto border-t border-[var(--color-border)] px-[var(--space-md)] py-[var(--space-lg)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          Workspace ready
        </p>
      </div>
    </aside>
  )
}
