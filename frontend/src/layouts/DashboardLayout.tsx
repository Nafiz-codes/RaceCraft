import MainContent from '@/components/dashboard/MainContent'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import { DashboardComparisonProvider } from '@/contexts/DashboardComparisonContext'
import type { ReactNode } from 'react'

export default function DashboardLayout(): ReactNode {
  return (
    <DashboardComparisonProvider>
      <div className="min-h-svh bg-[var(--color-background)] text-[var(--color-text-primary)] lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] xl:h-svh xl:grid-cols-[17.5rem_minmax(0,1fr)_20rem] xl:overflow-hidden">
        <Sidebar />
        <div className="flex min-w-0 flex-col xl:min-h-0">
          <TopBar />
          <MainContent />
        </div>
        <aside className="hidden border-l border-[var(--color-border)] bg-[var(--color-background-secondary)] p-[var(--space-md)] xl:flex xl:flex-col xl:gap-[var(--space-md)]">
          <section className="border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)]">
            <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">
              Context rail
            </p>
            <h2 className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)]">
              Session Context
            </h2>
            <p className="mt-[var(--space-lg)] text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
              Select a session to populate workspace context.
            </p>
          </section>
          <section className="flex min-h-0 flex-1 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)]">
            <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Engineering log
            </p>
            <p className="mt-auto border-t border-[var(--color-border)] pt-[var(--space-lg)] text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
              No workspace events are available until a session is selected.
            </p>
          </section>
        </aside>
      </div>
    </DashboardComparisonProvider>
  )
}
