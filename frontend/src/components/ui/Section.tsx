import type { HTMLAttributes, ReactNode } from 'react'

type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type SectionBackground = 'default' | 'secondary' | 'surface'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: SectionBackground
  children: ReactNode
  spacing?: SectionSpacing
}

const spacingClasses: Record<SectionSpacing, string> = {
  none: '',
  sm: 'py-[var(--space-sm)]',
  md: 'py-[var(--space-md)]',
  lg: 'py-[var(--space-lg)]',
  xl: 'py-[var(--space-xl)]',
  '2xl': 'py-[var(--space-2xl)]',
}

const backgroundClasses: Record<SectionBackground, string> = {
  default: 'bg-[var(--color-background)]',
  secondary: 'bg-[var(--color-background-secondary)]',
  surface: 'bg-[var(--color-surface)]',
}

export default function Section({
  background = 'default',
  children,
  className,
  spacing = 'xl',
  ...props
}: SectionProps): ReactNode {
  const classes = [spacingClasses[spacing], backgroundClasses[background], className]
    .filter(Boolean)
    .join(' ')

  return (
    <section {...props} className={classes}>
      {children}
    </section>
  )
}
