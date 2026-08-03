# RaceCraft Technology Stack

Version: 1.0

---

# Purpose

This document defines the official technology stack for RaceCraft.

Only the technologies listed here may be used unless the project documentation is updated.

Consistency is prioritized over experimenting with multiple libraries.

---

# Frontend Framework

## React

Purpose:

- User Interface
- Component Architecture

Reason:

- Mature ecosystem
- Excellent TypeScript support
- Large community
- Compatible with all selected libraries

---

## Vite

Purpose:

- Development environment
- Build tool

Reason:

- Fast startup
- Fast hot reload
- Lightweight
- Excellent React support

---

# Programming Language

## TypeScript

Purpose:

- Static typing
- Developer safety
- Maintainability

TypeScript is mandatory throughout the project.

---

# Styling

## Tailwind CSS

Purpose:

- Utility-first styling

Reason:

- Fast development
- Consistent spacing
- Easy responsiveness
- Matches the Stitch design workflow

---

## shadcn/ui

Purpose:

- Accessible UI components

Examples:

- Dialog
- Dropdown
- Sheet
- Tabs
- Tooltip
- Toast

All components should be customized to match the approved RaceCraft Design System.

---

# Animation

## Framer Motion

Purpose:

- Component animations
- Page transitions
- Hover effects
- UI micro-interactions

---

## GSAP

Purpose:

- Scroll-driven storytelling
- Timeline orchestration

GSAP should only control scroll-related experiences.

Framer Motion remains responsible for UI animations.

---

## Lenis

Purpose:

- Smooth scrolling

Reason:

Creates premium scrolling behavior for the landing experience.

---

# 3D Experience

## Spline

Purpose:

- Landing page Formula car
- Camera movement
- Engineering storytelling

Spline is only used for the landing experience.

Application dashboards remain standard React interfaces.

---

# Routing

## React Router

Purpose:

- Navigation
- Nested routes
- Dashboard routing

---

# Server State

## TanStack Query

Purpose:

- API requests
- Caching
- Background refetching
- Loading management

All server data should flow through TanStack Query.

---

# API Communication

## Axios

Purpose:

- HTTP requests

Reasons:

- Cleaner API
- Request interceptors
- Error handling
- Widely adopted

---

# Validation

## Zod

Purpose:

- Runtime validation
- API response validation
- Form validation

---

# Data Visualization

## Recharts

Purpose:

- Telemetry charts
- Speed graphs
- RPM graphs
- Brake traces
- Throttle traces

Charts should remain clean and engineering-focused.

---

# Formula 1 Data Sources

## FastF1

Purpose:

- Session data
- Telemetry
- Weather
- Laps
- Timing
- Driver information

Primary historical data provider.

---

## OpenF1

Purpose:

- Live API
- Supplemental race information

Used where FastF1 is unavailable or unsuitable.

---

# Icons

## Lucide React

Purpose:

- Icons
- Navigation
- Dashboard controls

---

# Fonts

Primary:

Inter

Monospace:

JetBrains Mono

Purpose:

Telemetry values
Lap times
Engineering data

---

# Theme

Primary Theme:

Dark

Accent:

Purple

Background:

Near black

The official color palette is defined by the approved Stitch Design System.

---

# Code Quality

## ESLint

Purpose:

Static code analysis

---

## Prettier

Purpose:

Automatic code formatting

---

# Version Control

## Git

Branch Strategy:

main

↓

develop

↓

feature/*

All work should occur on feature branches before merging.

---

# Deployment

Frontend:

Vercel

Backend:

Render or Railway

Database:

PostgreSQL (future)

---

# Future Integrations

Planned technologies include:

- Authentication
- User profiles
- Saved sessions
- Cloud storage
- AI-powered race analysis
- Driver comparison history

These are outside Version 1.0.

---

# Technology Philosophy

RaceCraft values stability over novelty.

Every technology included in this stack has a clear responsibility.

New libraries should only be introduced when they solve a significant problem that cannot be addressed by the existing stack.