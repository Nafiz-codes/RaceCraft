import type { ReactNode } from 'react'

import {
  type EngineeringInsight,
} from '@/components/dashboard/SessionReportExporter'

interface EngineeringInsightsPanelProps {
  insights: EngineeringInsight[]
}

function InsightCard({ insight }: { insight: EngineeringInsight }): ReactNode {
  return (
    <article className="border border-[var(--color-border)] p-[var(--space-md)]">
      <div className="flex items-center gap-[var(--space-sm)]">
        <span aria-hidden="true" className="flex size-5 items-center justify-center border border-[var(--color-border-hover)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] text-[var(--color-primary-purple)]">
          {insight.icon}
        </span>
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
          {insight.category}
        </p>
      </div>
      <h3 className="mt-[var(--space-sm)] text-[var(--font-size-small)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
        {insight.title}
      </h3>
      <p className="mt-1 text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
        {insight.explanation}
      </p>
    </article>
  )
}

export default function EngineeringInsightsPanel({ insights }: EngineeringInsightsPanelProps): ReactNode {
  return (
    <section id="engineering-insights" aria-labelledby="engineering-insights-title" className="flex min-h-48 flex-col border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--space-lg)] shadow-[var(--shadow-sm)] lg:col-span-12">
      <div className="border-l-2 border-[var(--color-primary-purple)] pl-[var(--space-md)]">
        <p className="[font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.12em] text-[var(--color-primary-purple)]">System 7A</p>
        <h2 id="engineering-insights-title" className="mt-[var(--space-sm)] text-[var(--font-size-heading-5)] leading-[var(--line-height-heading-5)] text-[var(--color-text-primary)]">Engineering Insights</h2>
      </div>
      {insights.length > 0 ? (
        <div className="mt-[var(--space-lg)] grid gap-[var(--space-sm)] border-t border-[var(--color-border)] pt-[var(--space-md)] sm:grid-cols-2 xl:grid-cols-4">
          {insights.map((insight) => <InsightCard key={`${insight.category}-${insight.title}`} insight={insight} />)}
        </div>
      ) : (
        <p className="mt-auto border-t border-[var(--color-border)] pt-[var(--space-lg)] text-[var(--font-size-small)] leading-[var(--line-height-small)] text-[var(--color-text-secondary)]">
          Select a primary driver lap to generate deterministic engineering observations.
        </p>
      )}
    </section>
  )
}
