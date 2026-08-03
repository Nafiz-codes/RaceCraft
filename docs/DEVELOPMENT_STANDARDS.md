# RaceCraft Development Standards

Version: 1.0

---

# Purpose

This document defines the engineering standards for the RaceCraft project.

All implementation—whether written by humans or AI assistants (Codex)—must follow these standards to ensure consistency, maintainability, scalability, and production readiness.

No implementation should introduce new architectural patterns without updating this document.

---

# Core Engineering Principles

RaceCraft prioritizes:

- Readability over cleverness
- Simplicity over unnecessary abstraction
- Reusable components over duplication
- Strong typing over implicit behavior
- Performance before optimization
- Accessibility by default
- Responsive design from the beginning
- Consistency across the entire application

---

# Project Structure

The frontend follows a feature-oriented architecture.

```
src/
│
├── assets/
├── components/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── services/
├── styles/
├── types/
└── utils/
```

Every folder has a single responsibility.

No folder should become a dumping ground.

---

# React Standards

- Functional components only
- React Hooks only
- No class components
- One component = one responsibility
- Components should remain as small as practical
- Extract repeated UI into reusable components

---

# TypeScript Standards

TypeScript is mandatory.

Rules:

- Avoid `any`
- Prefer interfaces for object structures
- Use explicit return types for exported functions
- Prefer strong typing over type assertions
- Keep types close to where they are used

---

# Naming Conventions

Components:

```
TelemetryChart.tsx
```

Hooks:

```
useTelemetry.ts
```

Pages:

```
DashboardPage.tsx
```

Utilities:

```
formatLapTime.ts
```

Interfaces:

```
Driver
SessionData
TelemetryPoint
```

Constants:

```
MAX_VISIBLE_LAPS
DEFAULT_THEME
```

Use descriptive names.

Avoid abbreviations unless they are universally understood.

---

# Styling Standards

Tailwind CSS is the primary styling system.

Rules:

- Utility classes preferred
- Avoid inline styles
- Reusable UI belongs inside components
- Follow the Design System exactly
- Do not introduce arbitrary colors or spacing

Visual appearance must match the approved Stitch designs.

---

# Animation Standards

Animation should communicate information.

Animation must never exist purely for decoration.

Allowed purposes:

- Guide attention
- Explain hierarchy
- Show relationships
- Confirm actions
- Smooth transitions

Preferred tools:

- Framer Motion
- GSAP (scroll orchestration only)

Avoid excessive motion.

---

# State Management

Local state:

React Hooks

Shared application state:

Context API

Server state:

TanStack Query

Do not introduce additional state management libraries unless approved.

---

# Data Fetching

All external communication must pass through the Services layer.

Example:

```
services/
    fastf1.ts
    openf1.ts
```

UI components should never call APIs directly.

---

# Error Handling

Every API request must handle:

- Loading
- Empty state
- Error state
- Success state

No uncaught errors should reach the user.

---

# Performance

Prioritize:

- Lazy loading
- Code splitting
- Memoization where justified
- Virtualization for large tables
- Efficient rendering

Optimize only after correctness.

---

# Accessibility

All interactive elements must include:

- Keyboard navigation
- Focus states
- Semantic HTML
- ARIA attributes where necessary
- Sufficient color contrast

Accessibility is required—not optional.

---

# Responsive Design

Desktop is the primary experience.

Layouts must gracefully adapt to:

- Laptop
- Tablet
- Mobile

Responsive behavior follows the approved Stitch designs.

---

# Code Quality

Every implementation should be:

- Modular
- Reusable
- Typed
- Documented where necessary
- Easy to understand

Avoid premature abstraction.

---

# Testing Philosophy

Code should be written to be testable.

Prefer:

- Pure functions
- Predictable state
- Isolated business logic

Testing implementation will be introduced in later development phases.

---

# AI Development Policy

AI-generated code is a starting point.

Every generated implementation must be:

- Reviewed
- Understood
- Tested
- Refined if necessary

AI must not invent architecture.

AI must follow the approved project documentation.

---

# Visual Source of Truth

Visual implementation follows:

1. Approved Stitch designs
2. UI_UX_SPEC.md

If visual ambiguity exists:

- Stitch determines appearance.
- UI_UX_SPEC determines behavior.

---

# Documentation

Whenever architecture changes:

Update:

- PRD (if scope changes)
- Architecture
- API
- UI/UX Specification

Documentation must remain synchronized with implementation.

---

# Final Principle

RaceCraft values engineering quality over development speed.

Every feature should feel intentional, polished, and maintainable.

The goal is not simply to finish the project.

The goal is to build a professional-grade engineering platform.