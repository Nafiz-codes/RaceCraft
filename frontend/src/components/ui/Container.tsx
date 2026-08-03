import type { HTMLAttributes, ReactNode } from 'react'

type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  maxWidth?: ContainerMaxWidth
}

const maxWidthClasses: Record<ContainerMaxWidth, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-none',
}

export function Container({
  children,
  className,
  maxWidth = '2xl',
  ...props
}: ContainerProps): ReactNode {
  const classes = [
    'mx-auto w-full px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]',
    maxWidthClasses[maxWidth],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div {...props} className={classes}>
      {children}
    </div>
  )
}
