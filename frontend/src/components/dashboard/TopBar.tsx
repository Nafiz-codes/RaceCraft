import type { ReactNode } from 'react'

interface TopBarProps {
  exportControl?: ReactNode
}

export default function TopBar({ exportControl }: TopBarProps): ReactNode {
  return (
    <header className="z-20 border-b border-[var(--color-border)] bg-[var(--color-background-secondary)]">
      <div className="grid min-h-16 grid-cols-1 items-center gap-x-[var(--space-lg)] gap-y-[var(--space-sm)] px-[var(--space-md)] py-[var(--space-sm)] sm:grid-cols-[minmax(0,1fr)_auto] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] 2xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="min-w-0">
          <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.14em] text-[var(--color-primary-purple)]">
            System 1A / Workspace
          </p>
          <h1 className="mt-[calc(var(--space-sm)/2)] whitespace-nowrap text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)]">
            Engineering Dashboard
          </h1>
        </div>

        <p className="order-3 col-span-2 hidden justify-self-center whitespace-nowrap border-x border-[var(--color-border)] px-[var(--space-lg)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-text-muted)] 2xl:order-none 2xl:col-span-1 2xl:block">
            Session / Awaiting selection
        </p>
        <div className="justify-self-start sm:justify-self-end">
          {exportControl}
        </div>
      </div>
    </header>
  )
}
