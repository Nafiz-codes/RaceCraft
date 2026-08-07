import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-[var(--color-primary-purple)] bg-[var(--color-primary-purple)] text-[var(--color-text-primary)] hover:border-[var(--color-primary-purple-hover)] hover:bg-[var(--color-primary-purple-hover)] hover:shadow-[var(--shadow-sm)]',
  secondary:
    'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]',
  ghost:
    'border-transparent bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]',
  danger:
    'border-[var(--color-danger)] bg-transparent text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-[var(--color-text-primary)]',
  icon:
    'border-[var(--color-border)] bg-[var(--color-surface)] px-0 text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-8 px-[var(--space-sm)] text-[var(--font-size-small)]',
  md: 'min-h-10 px-[var(--space-md)] text-[var(--font-size-body)]',
  lg: 'min-h-12 px-[var(--space-lg)] text-[var(--font-size-body-large)]',
  icon: 'size-10 px-0 text-[var(--font-size-body)]',
}

export default function Button({
  children,
  className,
  disabled,
  leftIcon,
  loading = false,
  rightIcon,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps): ReactNode {
  const isDisabled = disabled || loading
  const classes = [
    'inline-flex items-center justify-center gap-[var(--space-sm)] whitespace-nowrap rounded-[var(--radius-md)] border font-[var(--font-weight-medium)] transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--duration-normal)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-purple)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={classes}
      disabled={isDisabled}
      type={type}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  )
}
