# Project Organization Best Practices

## Project Structure Strategies

### 1. Store Project Files Outside of App
This strategy keeps the app directory focused purely on routing.

```
project/
├── app/                    # Only routing concerns
│   ├── layout.tsx
│   ├── page.tsx
│   └── [...routes]
├── components/            # Shared components
│   ├── ui/
│   └── features/
├── lib/                   # Shared utilities
│   ├── utils/
│   └── hooks/
├── styles/               # Global styles
└── types/               # TypeScript types
```

Benefits:
- Clear separation between routing and implementation
- Easy to find shared code
- Simple import paths
- Works well with module path aliases

### 2. Store Project Files Inside App
This strategy keeps related code closer to where it's used.

```
app/
├── _components/          # Shared components
├── _lib/                # Shared utilities
├── (routes)/            # Route groups
│   ├── dashboard/
│   │   ├── _components/ # Dashboard-specific components
│   │   ├── _lib/        # Dashboard-specific utilities
│   │   └── page.tsx
│   └── admin/
│       ├── _components/ # Admin-specific components
│       ├── _lib/        # Admin-specific utilities
│       └── page.tsx
└── layout.tsx
```

Benefits:
- Colocation of related code
- Better code splitting
- More modular
- Easier to move features

### 3. Split by Feature or Route
This strategy combines both approaches.

```
project/
├── app/
│   ├── (routes)/
│   │   └── [...route-specific code]
│   ├── _shared/         # Shared app-level code
│   └── layout.tsx
├── core/                # Core business logic
│   ├── auth/
│   ├── billing/
│   └── users/
└── shared/             # Project-wide shared code
    ├── components/
    ├── hooks/
    └── utils/
```

Benefits:
- Scales well with large teams
- Clear ownership boundaries
- Good for monorepos
- Flexible for different needs

## Colocation Rules

1. **Component Colocation**
   - Place components next to where they're used
   - Use `_components` for shared components
   - Keep component-specific types and tests together

2. **Utility Colocation**
   - Place utilities next to features that use them
   - Use `_lib` or `_utils` for shared utilities
   - Keep related code together

3. **Test Colocation**
   ```
   feature/
   ├── components/
   │   ├── Component.tsx
   │   └── Component.test.tsx
   ├── hooks/
   │   ├── useHook.ts
   │   └── useHook.test.ts
   └── utils/
       ├── util.ts
       └── util.test.ts
   ```

## Private Implementation Details

1. **Private Folders**
   - Use `_` prefix for non-route folders
   - Examples: `_components`, `_lib`, `_utils`

2. **Private Files**
   - Use `_` prefix for implementation files
   - Example: `_helpers.ts`, `_types.ts`

## Route Organization

1. **Route Groups**
   ```
   app/
   ├── (auth)/           # Authentication routes
   ├── (marketing)/      # Marketing pages
   └── (dashboard)/      # App features
   ```

2. **Parallel Routes**
   ```
   app/
   ├── @modal/          # Modal content
   │   └── default.tsx
   └── @sidebar/       # Sidebar content
       └── default.tsx
   ```

3. **Intercepting Routes**
   ```
   app/
   ├── feed/
   │   └── page.tsx
   └── (.)photo/      # Show photo without leaving feed
       └── page.tsx
   ```

## Best Practices

1. **Consistent Naming**
   - Use clear, descriptive names
   - Follow established patterns
   - Be consistent across the project

2. **Import Organization**
   ```typescript
   // External imports
   import { useState } from 'react'
   import { motion } from 'framer-motion'

   // Internal shared imports
   import { Button } from '@/components/ui'
   import { useAuth } from '@/lib/hooks'

   // Local imports
   import { ProductCard } from './_components'
   import { formatPrice } from './_utils'
   ```

3. **Type Organization**
   ```typescript
   // Colocate with feature
   feature/
   ├── types.ts         # Feature-specific types
   └── components/
       └── types.ts     # Component-specific types

   // Shared types
   types/
   ├── common.ts        # Shared types
   └── api.ts          # API types
   ```

4. **State Management**
   ```typescript
   // Local state
   components/
   └── Component.tsx    # useState, useReducer

   // Shared state
   lib/
   └── stores/         # Global state management
   ```

5. **API Integration**
   ```typescript
   // API routes
   app/
   └── api/
       └── [...routes]

   // API utilities
   lib/
   └── api/
       ├── client.ts    # API client
       └── hooks.ts     # API hooks
   ```

## Common Patterns

1. **Feature Organization**
   ```
   features/
   ├── auth/
   │   ├── _components/
   │   ├── _hooks/
   │   └── _utils/
   └── products/
       ├── _components/
       ├── _hooks/
       └── _utils/
   ```

2. **Data Flow Organization**
   ```
   lib/
   ├── api/            # API integration
   ├── db/             # Database access
   └── stores/         # State management
   ```

3. **Style Organization**
   ```
   styles/
   ├── globals.css    # Global styles
   ├── themes/        # Theme definitions
   └── components/    # Component styles
   ```

This document serves as a guide for organizing Next.js projects. Choose the strategy that best fits your team's needs and be consistent in its application.
