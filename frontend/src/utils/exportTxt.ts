import type { EngineeringReport } from '@/utils/reportGenerator'

export function exportTxt(report: EngineeringReport): void { const blob = new Blob([report.lines.join('\n')], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${report.fileStem}.txt`; link.click(); URL.revokeObjectURL(url) }
