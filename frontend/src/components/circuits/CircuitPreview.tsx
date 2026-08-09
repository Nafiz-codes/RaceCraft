import type { ReactNode } from 'react'

interface CircuitPreviewProps { circuitId: string; circuitName: string }

const TRACKS = [
  'M34 84 C33 35 92 26 127 49 C158 70 144 104 117 112 C83 123 69 99 84 79 C98 61 145 65 167 38 C188 13 236 29 231 78 C228 111 185 122 159 99',
  'M29 69 C45 30 103 26 119 58 C133 86 105 113 77 102 C50 91 72 60 108 70 C144 79 144 119 184 113 C222 107 233 49 201 35 C171 23 157 46 171 64',
  'M33 44 C62 11 110 29 104 61 C99 91 57 104 77 126 C99 150 149 128 143 92 C137 55 190 39 220 66 C245 89 224 126 193 119',
  'M32 100 C25 58 55 32 91 44 C127 56 109 90 78 87 C46 83 49 125 86 132 C123 139 157 110 143 74 C130 40 184 24 215 48 C242 69 231 109 199 113',
]

export default function CircuitPreview({ circuitId, circuitName }: CircuitPreviewProps): ReactNode {
  const track = TRACKS[[...circuitId].reduce((total, character) => total + character.charCodeAt(0), 0) % TRACKS.length]
  return <svg viewBox="0 0 260 160" role="img" aria-label={`${circuitName} circuit preview`} className="h-full w-full max-w-sm"><path d={track} fill="none" stroke="var(--color-border)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /><path d={track} fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="34" cy="84" r="4" fill="var(--color-f1-red)" /></svg>
}
