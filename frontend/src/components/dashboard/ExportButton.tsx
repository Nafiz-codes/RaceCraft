import type { ReactNode } from 'react'

import { downloadSessionReport, type SessionReportState } from '@/components/dashboard/SessionReportExporter'

interface ExportButtonProps {
  reportState: SessionReportState
}

export default function ExportButton({ reportState }: ExportButtonProps): ReactNode {
  const canExport = Boolean(reportState.primaryLap && reportState.primaryTelemetry?.length)

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={!canExport}
        onClick={() => downloadSessionReport(reportState, 'markdown')}
        className="border border-[var(--color-primary-purple)] px-[var(--space-sm)] py-1 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-primary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-purple)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Export Report .md
      </button>
      <button
        type="button"
        disabled={!canExport}
        onClick={() => downloadSessionReport(reportState, 'text')}
        className="border border-[var(--color-border)] px-[var(--space-sm)] py-1 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-purple)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        .txt
      </button>
    </div>
  )
}
