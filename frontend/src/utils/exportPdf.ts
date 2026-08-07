import type { EngineeringReport } from '@/utils/reportGenerator'

export function exportPdf(report: EngineeringReport): void {
  const lines = report.lines.flatMap((line) => line.match(/.{1,88}/g) ?? [''])
  const escape = (line: string) => line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
  const stream = `BT /F1 10 Tf 48 790 Td 14 TL ${lines.map((line) => `(${escape(line)}) Tj T*`).join('\n')} ET`
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`]
  let pdf = '%PDF-1.4\n'; const offsets = [0]
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n` })
  const xref = pdf.length; pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' })); const link = document.createElement('a'); link.href = url; link.download = `${report.fileStem}.pdf`; link.click(); URL.revokeObjectURL(url)
}
