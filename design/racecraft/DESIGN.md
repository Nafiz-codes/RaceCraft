---
name: RACECRAFT
colors:
  surface: '#11131a'
  surface-dim: '#141317'
  surface-bright: '#3b383d'
  surface-container-lowest: '#0f0d15'
  surface-container-low: '#1c1b1f'
  surface-container: '#211f23'
  surface-container-high: '#2b292d'
  surface-container-highest: '#363438'
  on-surface: '#e6e1e7'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e6e1e7'
  inverse-on-surface: '#323034'
  outline: '#948f9a'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#e9ddff'
  on-primary: '#37265e'
  primary-container: '#d0bcff'
  on-primary-container: '#594983'
  inverse-primary: '#665590'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#f1e488'
  on-tertiary: '#363100'
  tertiary-container: '#d4c86f'
  on-tertiary-container: '#5c5301'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#210f48'
  on-primary-fixed-variant: '#4d3d76'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#f1e588'
  tertiary-fixed-dim: '#d4c86f'
  on-tertiary-fixed: '#201c00'
  on-tertiary-fixed-variant: '#4f4800'
  background: '#06070a'
  on-background: '#e6e1e7'
  surface-variant: '#363438'
  telemetry-throttle: '#10b981'
  telemetry-brake: '#f43f5e'
  telemetry-drs: '#fbbf24'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  section-gap: 64px
  gutter: 16px
  component-padding: 12px
  container-margin: 32px
  unit: 4px
---

## Brand & Style
RACECRAFT is a high-performance telemetry and engineering platform designed for motorsport professionals and elite enthusiasts. The brand personality is clinical, precise, and data-driven, evoking the atmosphere of an F1 garage at midnight.

The design style is **Glassmorphism mixed with Technical Minimalism**. It utilizes deep obsidian surfaces, ultra-thin borders, and vibrant "digital glow" accents to simulate a high-tech HUD (Heads-Up Display). The aesthetic prioritizes information density and real-time legibility, using monospaced fonts for numerical data to ensure visual alignment and a professional, engineered feel.

## Colors
The palette is rooted in a "Deep Space" dark mode, using `#06070a` as the void and progressively lighter obsidian shades for container hierarchy. 

- **Primary (Lavender Glow):** Used for interactive states, key highlights, and primary data streams (RPM, Track Markers).
- **Secondary (Cyan):** Reserved for speed, lap times, and navigational accents.
- **Functional Accents:** A strict semantic system for telemetry: Emerald (`#10b981`) for throttle/optimal temps, Rose (`#f43f5e`) for braking/high heat, and Amber (`#fbbf24`) for DRS and warnings.
- **Overlays:** Surfaces use 80-95% opacity with 12px-20px background blurs to maintain context over the telemetry grid.

## Typography
The system employs a dual-font strategy:
1. **Inter** is the structural workhorse, used for UI chrome, headers, and general reading. It provides a clean, neutral foundation that doesn't distract from data.
2. **JetBrains Mono** is the "Engine" font. Every piece of dynamic data, numerical value, and technical label must be rendered in this monospaced typeface to ensure column stability as values fluctuate.

All labels should be uppercase with generous letter spacing (`0.1em`) to enhance the "instrument panel" aesthetic.

## Layout & Spacing
The layout follows a **Fixed-Sidebar Fluid-Canvas** model. 
- **Sidebar:** Fixed at 280px on desktop, collapsing to a hidden state on mobile.
- **Main Canvas:** A responsive grid that flexes to fill available screen real estate, utilizing a 16px gutter between telemetry widgets.
- **Telemetry Grid:** Backgrounds feature a 40px x 40px grid pattern created with `rgba(255,255,255,0.03)` lines to provide a spatial reference for chart data.
- **Rhythm:** Spacing is strictly derivative of a 4px base unit. Padding within cards is typically 12px (3 units) or 16px (4 units).

## Elevation & Depth
Depth is created through **Luminance and Blur** rather than traditional shadows.
- **Base Level:** `#06070a` (The Canvas).
- **Layer 1 (Panels):** `#0f0d15` with a `1px` border of `outline-variant/10`.
- **Layer 2 (Interactive/Floating):** `glass-panel` style using `rgba(15, 13, 21, 0.8)` background with a `12px` backdrop blur.
- **Interactive Depth:** Hover states on buttons and charts should trigger a subtle outer glow (e.g., `0 0 15px rgba(208, 188, 255, 0.3)`) to simulate light emission from a screen.

## Shapes
The shape language is "Precision Geometric." 
- **Standard Radius:** 2px (`rounded-sm`) for buttons and small inputs to maintain a sharp, technical edge.
- **Container Radius:** 8px (`rounded-lg`) or 12px (`rounded-xl`) for main telemetry cards to soften the overall density of the screen.
- **Controls:** Circular elements (full rounding) are reserved exclusively for the transport controls (Play/Pause) and status indicators to make them instantly recognizable as touch/click targets.

## Components
- **Buttons:** Technical buttons use a solid `#37333d` (surface-container-highest) background with a subtle border. The "Primary" action button is a floating circle with a high-intensity lavender glow.
- **Telemetry Charts:** SVG-based lines should be `1.5pt` thick. Active data lines use `primary` or `secondary` colors, while ghost/comparison laps use `outline` at 30% opacity.
- **Scrubber/Playhead:** A vertical line spanning the height of the chart area with a 1px width, topped with a glowing node.
- **Status Chips:** Small, high-contrast indicators (e.g., DRS Active) use a background tint at 20% opacity and a solid 1px trailing border on the active side.
- **Data Cards:** Grouped items should be separated by `outline-variant/10` dividers. Every data card must have a `label-sm` header in uppercase.