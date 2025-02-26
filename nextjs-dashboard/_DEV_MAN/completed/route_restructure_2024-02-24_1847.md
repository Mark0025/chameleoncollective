# Route Structure Enhancement Task
Status: Pending
Timestamp: 2024-02-24 18:47 CST

## Overview
Implement proper Next.js route grouping and component organization following established conventions.

## Current Issues
1. Missing route groups for auth/public separation
2. Components scattered across ui/ directory
3. Missing admin layout structure
4. Navigation not properly organized

## Proposed Structure
```
app/
├── (auth)/             # Protected routes
│   ├── admin/         # Admin section
│   │   ├── layout.tsx
│   │   ├── events/
│   │   ├── products/
│   │   └── settings/
│   └── dashboard/     # User dashboard
├── (public)/          # Public routes
│   ├── book/
│   ├── contact/
│   └── rentals/
└── _components/       # Private components
    ├── ui/           # Base UI components
    ├── admin/        # Admin components
    └── dashboard/    # Dashboard components
```

## Implementation Plan

### 1. Create Route Groups
```typescript
// Move existing routes into proper groups
(auth)/
  - Move admin/* and dashboard/* here
(public)/
  - Move public routes here
```

### 2. Create Admin Layout
```typescript
// app/(auth)/admin/layout.tsx
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

### 3. Reorganize Components
```typescript
// Move from app/ui to app/_components
_components/
  ui/ - Base components
  admin/ - Admin-specific
  dashboard/ - Dashboard-specific
```

### 4. Update Navigation
```typescript
_components/navigation/
  AdminNav.tsx
  DashboardNav.tsx
  PublicNav.tsx
```

## Success Criteria
- [ ] Route groups properly organized
- [ ] Admin layout implemented
- [ ] Components reorganized
- [ ] Navigation working correctly
- [ ] No 404 errors on admin routes
- [ ] Proper auth protection maintained

## Dependencies
- Previous auth system implementation
- Existing component structure
- Current routing setup

## Notes
- Keep existing functionality while restructuring
- Maintain type safety throughout
- Follow Next.js conventions strictly
- Use proper error boundaries
