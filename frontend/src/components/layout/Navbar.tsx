import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

const navigationLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#drivers', label: 'Drivers' },
  { href: '#circuits', label: 'Circuits' },
  { href: '#telemetry-preview', label: 'Telemetry' },
  { href: '#about', label: 'About' },
]

export default function Navbar(): ReactNode {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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
          <a
            href="#hero"
            className="text-[var(--font-size-body-large)] font-[var(--font-weight-bold)] tracking-[-0.03em] text-[var(--color-text-primary)]"
          >
            RaceCraft
          </a>

          <div className="hidden items-center gap-[var(--space-xl)] lg:flex">
            {navigationLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="border-b border-transparent py-[var(--space-sm)] text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-purple)] hover:text-[var(--color-text-primary)] active:border-[var(--color-primary-purple)] active:text-[var(--color-primary-purple)]"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="hidden lg:block">
            <Button
              className="tracking-[0.02em] hover:shadow-[var(--shadow-sm)] focus-visible:shadow-[var(--shadow-sm)]"
              size="sm"
            >
              Launch Dashboard
            </Button>
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
            {navigationLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="border-l-2 border-transparent px-[var(--space-md)] py-[var(--space-sm)] text-[var(--font-size-caption)] font-[var(--font-weight-medium)] uppercase tracking-[0.1em] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-purple)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] active:border-[var(--color-primary-purple)] active:text-[var(--color-primary-purple)]"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <Button
              className="mt-[var(--space-sm)] w-full tracking-[0.02em] hover:shadow-[var(--shadow-sm)] focus-visible:shadow-[var(--shadow-sm)]"
              size="sm"
            >
              Launch Dashboard
            </Button>
          </nav>
        </div>
      </Container>
    </header>
  )
}
