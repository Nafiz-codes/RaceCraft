import type { EngineeringReport } from '@/utils/reportGenerator'

function download(content: string, filename: string, type: string): void { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url) }
export function exportMarkdown(report: EngineeringReport): void { download(`# ${report.title}\n\n${report.lines.map((line) => line.endsWith(':') ? `## ${line.slice(0, -1)}` : line).join('\n')}`, `${report.fileStem}.md`, 'text/markdown;charset=utf-8') }
