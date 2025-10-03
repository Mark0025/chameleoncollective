# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HiveMarketOK** (formerly Chameleon Collective) - A Next.js 15 party & event rental platform with Clerk authentication, role-based access control, and PostgreSQL database integration.

**Tech Stack:**
- Next.js 15.1.7 (App Router)
- React 19
- TypeScript
- Clerk Authentication
- PostgreSQL (Neon)
- Tailwind CSS + shadcn/ui components
- pnpm package manager

## Repository Structure

```
/amandas-app/nextjs-dashboard/    # Main Next.js application
  ├── app/
  │   ├── (auth)/                 # Protected routes (admin, dashboard)
  │   ├── (public)/               # Public routes (landing, booking, contact)
  │   ├── api/                    # API routes
  │   ├── lib/                    # Server actions, utilities, data fetching
  │   └── ui/                     # Legacy UI components (being migrated)
  ├── components/                 # React components (follows Next.js convention)
  │   ├── AdminComponents/        # Admin-specific components
  │   ├── booking/                # Booking flow components
  │   ├── dashboard/              # Dashboard components
  │   ├── landing/                # Landing page components
  │   ├── rental/                 # Rental form components
  │   └── ui/                     # shadcn/ui components
  ├── config/
  │   └── brand.yaml              # Centralized brand configuration
  └── tests/
      ├── unit/                   # Unit tests
      ├── integration/            # Integration tests
      └── e2e/                    # Playwright E2E tests
```

## Development Commands

### Basic Development
```bash
cd amandas-app/nextjs-dashboard
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Testing
```bash
pnpm test                    # Run all Jest tests
pnpm test:watch              # Run tests in watch mode
pnpm test:unit               # Run unit tests only
pnpm test:integration        # Run integration tests only
pnpm test:e2e                # Run Playwright E2E tests
```

### Single Test Execution
```bash
pnpm test tests/unit/components/booking/AgeVerificationDialog.test.tsx
pnpm test:unit -- --testNamePattern="should render"
```

## Architecture & Conventions

### Route Groups (Next.js 15 Pattern)
- **(auth)/** - Protected routes requiring authentication
  - `/admin/*` - Admin-only routes (role check)
  - `/dashboard/*` - User dashboard routes
- **(public)/** - Public routes (no auth required)
  - `/` - Landing page
  - `/book` - Booking form
  - `/contact` - Contact page
  - `/rentals` - Rental listings

### Component Organization Rule
**CRITICAL:** All React components (except `page.tsx` and `layout.tsx`) MUST be in `/components` directory, NOT in `/app`. This is enforced by Cursor rules.

### Authentication Flow
1. **Clerk Middleware** (`middleware.tsx`) - Handles route protection
2. **Role-based Access** - Admin role stored in Clerk user metadata
3. **Public Routes** - Defined in middleware, bypass auth
4. **Protected Routes** - Redirect to sign-in if unauthenticated
5. **Admin Routes** - Check role in addition to auth

### Server Actions Pattern
```typescript
// All server actions in app/lib/actions/ or app/lib/actions/*.ts
'use server'

import { auth } from '@clerk/nextjs/server'

export async function myAction() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  // ... action logic
}
```

### Brand Configuration System
- YAML-based config at `config/brand.yaml`
- Type-safe service at `app/lib/brand/service.ts`
- Centralized colors, business info, social media
- Used throughout app for consistent branding

## Current State & Known Issues

### Working Features
- ✅ Clerk authentication & role-based access
- ✅ Public booking form (anonymous users)
- ✅ Admin dashboard (all bookings)
- ✅ User dashboard (user-specific bookings)
- ✅ Brand configuration system
- ✅ Route protection with middleware
- ✅ Building locally successfully

### Known Issues
- ⚠️ Clerk login redirects to `localhost:3000` instead of `/dashboard` (noted in commit d01bcd9)
- ⚠️ Some TypeScript/ESLint errors may exist
- ⚠️ Brand config not applying in all areas
- ⚠️ Database schema may need updates (check `status` column in bookings)

### Active Development
- Currently on branch: `feature/AppLayout`
- Recent work: UI refactoring, dashboard layout, overview file fixes
- Last commit: June 18, 2025 - "renamed a the overview file without the () it is now building locally"

## Agent Collaboration Rules

This project uses a multi-agent development workflow (from `.cursorrules`):

1. **Always read** `_DEV_MAN/` folder before starting work
2. **Document changes** in `_DEV_MAN/whats_working.md`
3. **Version yourself** using pattern: `agent(X.YY) - YYYY-MM-DD - HH:MM`
4. **Create task docs** in `_DEV_MAN/ai-agent-tasks/`
5. **Use mermaid diagrams** for complex workflows
6. **Include confidence scores** in handoffs

## Database

- **Provider:** Neon PostgreSQL
- **Schema:** User roles, bookings with status, events, products, categories
- **Connection:** Via `DATABASE_URL` in env vars
- **Seeding:** Available via `/app/seed/route.ts`

## Deployment

- **Platform:** Vercel
- **Config:** `vercel.json` in `amandas-app/nextjs-dashboard/`
- **Environment:** Clerk keys, database URL configured
- **Production branch:** Set to `production` deployment enabled

## Important Notes

- Use pnpm, not npm/yarn
- React 19 requires updated testing patterns
- Server Components are default, add 'use client' only when needed
- Middleware handles ALL route protection
- Brand configuration is centralized - don't hardcode colors/business info
