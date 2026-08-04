import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import TelemetryPreview from '@/components/sections/TelemetryPreview'
import DriverComparison from '@/components/sections/DriverComparison'
import Features from '@/components/sections/Features'
import type { ReactNode } from 'react'

export default function LandingLayout(): ReactNode {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <TelemetryPreview />

        <DriverComparison />

        <Features />
      </main>

      <footer>
        <Section spacing="lg" background="surface">
          <Container>
            <h2>Footer</h2>
          </Container>
        </Section>
      </footer>
    </>
  )
}
