import type { ReactNode } from 'react'

export default function TopBar(): ReactNode {
  return (
    <header className="z-20 border-b border-[var(--color-border)] bg-[var(--color-background-secondary)]">
      <div className="flex min-h-16 items-center justify-between gap-[var(--space-lg)] px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
        <div className="min-w-0">
          <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.14em] text-[var(--color-primary-purple)]">
            System 1A / Workspace
          </p>
          <h1 className="mt-[calc(var(--space-sm)/2)] truncate text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)]">
            Engineering Dashboard
          </h1>
        </div>

        <p className="hidden border-l border-[var(--color-border)] pl-[var(--space-lg)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-text-muted)] sm:block">
          Session / Awaiting selection
        </p>
      </div>
    </header>
  )
}
