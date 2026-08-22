# Project Steering Rules — GovernIQ (DevLeague 2026)

## Context

7-hour hackathon prototype. Optimize for a working end-to-end demo, not production code.

## Stack (non-negotiable)

- Next.js 14, App Router, TypeScript strict mode
- Tailwind CSS only
- shadcn/ui primitives before raw HTML elements
- lucide-react icons
- Framer Motion, durations 200-400ms only
- Google Gemini 2.5 Flash via Vercel AI SDK
- Static JSON in /data — no database, no ORM, no auth

## Scope discipline

- No authentication, no database, no tests, no Docker
- If a feature would take more than 45 minutes, flag before proceeding

## Code style

- Server components by default, client components only when needed
- kebab-case filenames, PascalCase components
