import Button from '@/components/ui/Button'
import RaceCraftLogo from '@/components/branding/RaceCraftLogo'
import Container from '@/components/ui/Container'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

const navigationLinks = [
  { to: '/', label: 'Home' },
  { to: '/drivers', label: 'Drivers' },
  { to: '/circuits', label: 'Circuits' },
  { to: '/telemetry', label: 'Telemetry' },
  { to: '/about', label: 'About' },
]

export default function Navbar(): ReactNode {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  useEffect(() => {
    const updateScrolledState = (): void => {
      setIsScrolled(window.scrollY > 8)
    }

    updateScrolledState()
    window.addEventListener('scroll', updateScrolledState, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScrolledState)
    }
  }, [])

  const headerClasses = [
    'sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-standard)]',
    isScrolled
      ? 'border-[var(--color-border)] bg-[var(--color-background)] shadow-[var(--shadow-sm)]'
      : 'border-transparent bg-transparent',
  ].join(' ')

  const mobileMenuClasses = [
    'overflow-hidden transition-[max-height,opacity] duration-[var(--duration-normal)] ease-[var(--ease-standard)] lg:hidden',
    isMenuOpen ? 'max-h-96 opacity-100' : 'pointer-events-none max-h-0 opacity-0',
  ].join(' ')

  return (
    <header className={headerClasses}>
      <Container>
        <nav className="flex min-h-[4.5rem] items-center justify-between" aria-label="Primary navigation">
          <Link to="/" aria-label="RaceCraft home" className="inline-flex shrink-0 items-center">
            <RaceCraftLogo className="h-8 w-[9.4rem]" />
          </Link>

          <div className="hidden items-center gap-[var(--space-xl)] lg:flex">
            {navigationLinks.map(({ to, label }) => (
              <NavLink
                key={label}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `border-b py-[var(--space-sm)] text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] transition-[border-color,color] duration-[var(--duration-fast)] ${isActive ? 'border-[var(--color-f1-red)] text-[var(--color-text-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-f1-red)] hover:text-[var(--color-text-primary)]'}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link to="/dashboard" aria-current={isDashboard ? 'page' : undefined}><Button className={`tracking-[0.02em] hover:shadow-[var(--shadow-sm)] focus-visible:shadow-[var(--shadow-sm)] ${isDashboard ? 'border-[var(--color-f1-red)] bg-[var(--color-f1-red)]' : ''}`} size="sm">Launch Dashboard</Button></Link>
          </div>

          <Button
            aria-controls="landing-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden"
            size="sm"
            variant="ghost"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
              <path
                d={isMenuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
          </Button>
        </nav>

        <div id="landing-navigation" className={mobileMenuClasses}>
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-[var(--space-sm)] border-t border-[var(--color-border)] bg-[var(--color-background)] py-[var(--space-lg)]"
          >
            {navigationLinks.map(({ to, label }) => (
              <NavLink
                key={label}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `border-l-2 px-[var(--space-md)] py-[var(--space-sm)] text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] transition-[background-color,border-color,color] duration-[var(--duration-fast)] ${isActive ? 'border-[var(--color-f1-red)] bg-[var(--color-surface)] text-[var(--color-text-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-f1-red)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <Link to="/dashboard" aria-current={isDashboard ? 'page' : undefined} onClick={() => setIsMenuOpen(false)}><Button className={`mt-[var(--space-sm)] w-full tracking-[0.02em] hover:shadow-[var(--shadow-sm)] focus-visible:shadow-[var(--shadow-sm)] ${isDashboard ? 'border-[var(--color-f1-red)] bg-[var(--color-f1-red)]' : ''}`} size="sm">Launch Dashboard</Button></Link>
          </nav>
        </div>
      </Container>
    </header>
  )
}
