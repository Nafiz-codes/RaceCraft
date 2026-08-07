import type { ReactNode } from 'react'

import type { DashboardView } from '@/components/dashboard/Sidebar'
import type { SessionReportState } from '@/components/dashboard/SessionReportExporter'
import { exportMarkdown } from '@/utils/exportMarkdown'
import { exportPdf } from '@/utils/exportPdf'
import { exportTxt } from '@/utils/exportTxt'
import { generateEngineeringReport } from '@/utils/reportGenerator'

interface ExportButtonProps {
  reportState: SessionReportState
  activeView: DashboardView
}

export default function ExportButton({ reportState, activeView }: ExportButtonProps): ReactNode {
  const canExport = Boolean(reportState.primarySelection.season || reportState.primaryLap || reportState.circuit)
  const report = () => generateEngineeringReport(reportState, activeView)

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={!canExport}
        onClick={() => exportPdf(report())}
        className="border border-[var(--color-primary-purple)] px-[var(--space-sm)] py-1 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-primary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-purple)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Export PDF
      </button>
      <button
        type="button"
        disabled={!canExport}
        onClick={() => exportMarkdown(report())}
        className="border border-[var(--color-border)] px-[var(--space-sm)] py-1 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-purple)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Export Markdown
      </button>
      <button type="button" disabled={!canExport} onClick={() => exportTxt(report())} className="border border-[var(--color-border)] px-[var(--space-sm)] py-1 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-50">
        Export TXT
      </button>
    </div>
  )
}
