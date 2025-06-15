# Next.js Project Structure and Conventions

## Directory Structure

```
app/
├── (groups)/            # Route groups - Don't affect URL paths
│   ├── (auth)/         # Group for authenticated routes
│   ├── (public)/       # Group for public routes
│   └── (admin)/        # Group for admin routes
├── _lib/               # Private shared code
├── _components/        # Private shared components
├── api/                # API routes
└── [...routes]/        # App routes
```

## Special Files

- `layout.tsx` - Shared UI for a segment
- `page.tsx` - UI unique to a route
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 UI
- `route.ts` - API endpoints
- `middleware.ts` - Request middleware

## Route Conventions

### Route Groups
- Use `(folderName)` for organizational grouping without affecting URLs
- Example: `(auth)/dashboard` routes to `/dashboard`

### Private Folders
- Use `_folderName` to opt out of routing
- For implementation details and internal code
- Example: `_components`, `_lib`, `_utils`

### Dynamic Routes
- `[param]` - Dynamic segment
- `[...catchAll]` - Catch-all segment
- `[[...optional]]` - Optional catch-all

### Parallel Routes
- `@modal` - Named slots
- `@dashboard` - Parallel routes

### Intercepting Routes
- `(.)` - Same level
- `(..)` - One level up
- `(..)(..)` - Two levels up
- `(...)` - Root level

## Component Organization

### Shared Components
```
_components/
├── ui/                 # Reusable UI components
│   ├── button.tsx
│   └── input.tsx
├── forms/             # Form-related components
└── layout/            # Layout components
```

### Route Components
- Colocate with routes when specific to that route
- Example: `app/dashboard/_components`

## Data and Business Logic

### Server Actions
```
_lib/
├── actions/           # Server actions
│   ├── auth.ts
│   └── data.ts
├── db/               # Database utilities
└── utils/            # Helper functions
```

## Best Practices

1. **Route Organization**
   - Group related routes using `(group)` syntax
   - Use private folders for internal implementation
   - Colocate route-specific code with routes

2. **Component Structure**
   - Place shared components in `_components`
   - Route-specific components go in route folders
   - Use `ui/` for base components

3. **Data Handling**
   - Server actions in `_lib/actions`
   - Database logic in `_lib/db`
   - Utils in `_lib/utils`

4. **Layout Structure**
   ```
   app/
   ├── layout.tsx              # Root layout
   ├── (auth)/
   │   ├── layout.tsx         # Auth layout
   │   └── [...auth routes]
   └── (public)/
       ├── layout.tsx         # Public layout
       └── [...public routes]
   ```

5. **File Naming**
   - Use kebab-case for files: `auth-utils.ts`
   - Use PascalCase for components: `AuthButton.tsx`
   - Use camelCase for utilities: `formatDate.ts`

## Common Patterns

### Authentication Layout
```typescript
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      <nav className="auth-nav" />
      {children}
    </div>
  )
}
```

### Route Group Layout
```typescript
// app/(admin)/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      <AdminNav />
      <main>{children}</main>
    </div>
  )
}
```

### Error Boundaries
```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## Metadata Handling

### Icons and Images
```
app/
├── favicon.ico
├── icon.png
├── apple-icon.png
├── opengraph-image.png
└── twitter-image.png
```

### SEO
```
app/
├── robots.txt
└── sitemap.xml
```

## Environment Configuration

```
.env                    # Default
.env.local             # Local overrides
.env.development       # Development
.env.production        # Production
```

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"]
    }
  }
}
```

This document serves as a reference for maintaining consistent project structure and following Next.js best practices. It should be updated as new patterns emerge or conventions change.
