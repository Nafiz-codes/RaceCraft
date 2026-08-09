import type { ReactNode } from 'react'

interface RaceCraftLogoProps {
  className?: string
  compact?: boolean
  title?: string
}

/**
 * RaceCraft's original mark: an angular R constructed around a telemetry line.
 * It uses the design-system foreground and F1-red tokens so it remains legible
 * wherever the shared dark application surface is used.
 */
export default function RaceCraftLogo({
  className = '',
  compact = false,
  title = 'RaceCraft',
}: RaceCraftLogoProps): ReactNode {
  const width = compact ? 40 : 188

  return (
    <svg
      aria-label={title}
      className={className}
      fill="none"
      role="img"
      viewBox={`0 0 ${width} 40`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path d="M4 34V6h15.5c7.1 0 11.5 3.3 11.5 9.1 0 4.2-2.4 7.1-6.4 8.4L34 34h-8.8l-8.1-9.4H12v9.4H4Z" fill="var(--color-text-primary)" />
      <path d="M12 12h7c2.6 0 4.1 1.1 4.1 3.2 0 2.2-1.5 3.3-4.1 3.3h-7V12Z" fill="var(--color-background)" />
      <path d="M5 34 17.4 21.6h14.4" stroke="var(--color-f1-red)" strokeLinecap="square" strokeWidth="3" />
      <circle cx="33" cy="21.6" r="2.4" fill="var(--color-f1-red)" />
      {!compact && (
        <text
          fill="var(--color-text-primary)"
          fontFamily="var(--font-family-base)"
          fontSize="20"
          fontWeight="700"
          letterSpacing="1.8"
          x="50"
          y="27"
        >
          RACECRAFT
        </text>
      )}
    </svg>
  )
}
