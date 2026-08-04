import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import type { ReactNode } from 'react'

export default function LandingLayout(): ReactNode {
  return (
    <>
      <header aria-label="Primary navigation" />

      <main>
        <Section id="hero" spacing="2xl">
          <Container>
            <h1>Hero</h1>
          </Container>
        </Section>

        <Section id="telemetry-preview" spacing="2xl" background="secondary">
          <Container>
            <h2>Telemetry Preview</h2>
          </Container>
        </Section>

        <Section id="driver-comparison" spacing="2xl">
          <Container>
            <h2>Driver Comparison</h2>
          </Container>
        </Section>

        <Section id="features" spacing="2xl" background="secondary">
          <Container>
            <h2>Features</h2>
          </Container>
        </Section>
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
