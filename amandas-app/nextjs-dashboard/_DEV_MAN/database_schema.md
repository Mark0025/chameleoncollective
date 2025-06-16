# Database Schema & Type System Documentation

## Database Tables

### 1. Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255)
);
```
TypeScript Interface:
```typescript
type User = {
  id: string;
  clerk_id: string;
  role: 'admin' | 'user';
  first_name?: string;
  last_name?: string;
  email: string;
};
```
Purpose:
- Stores user information from Clerk authentication
- Manages role-based access control
- Links to bookings through clerk_id

### 2. Products Table (Events)
```sql
CREATE TABLE products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL
);
```
TypeScript Interface:
```typescript
type Product = {
  id: string;
  name: string;
  price: number;  // stored in cents
  description: string;
  category: string;
};

type Event = Product & {
  date?: Date;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  createdAt?: Date;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  userId?: string;
};
```
Purpose:
- Stores product information including events
- Base table for all rentable items
- Events are products with category = 'events'

### 3. Bookings Table
```sql
CREATE TABLE bookings (
  id VARCHAR(255) PRIMARY KEY,
  event_id VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(255),
  user_id VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(clerk_id)
);
```
TypeScript Interface:
```typescript
type Booking = {
  id: string;
  event_id: string;
  date: Date;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  user_id?: string;  // Optional, links to authenticated user
};
```
Purpose:
- Stores event bookings
- Links customers to events
- Tracks booking status
- Optional user association for authenticated bookings

## Relationships

1. Bookings → Users (Optional)
   - Foreign Key: bookings.user_id → users.clerk_id
   - Purpose: Links bookings to authenticated users
   - Nullable: Yes (allows anonymous bookings)

2. Bookings → Products
   - Foreign Key: bookings.event_id → products.id
   - Purpose: Links bookings to specific events
   - Nullable: No (every booking must have an event)

## Status Workflows

### Booking Status Flow
```
pending → confirmed → completed
      ↘           ↘
        cancelled   cancelled
```

- pending: Initial state for new bookings
- confirmed: Approved by admin
- completed: Event has occurred
- cancelled: Cancelled at any point

## Important Notes

1. Price Storage
   - All prices are stored in cents (integers)
   - Must be converted to dollars for display
   - Example: 15000 cents = $150.00

2. Date Handling
   - All dates stored as TIMESTAMP in database
   - Converted to Date objects in TypeScript
   - UTC timestamps used for consistency

3. Authentication
   - Clerk.js handles user authentication
   - Users table extends Clerk data
   - clerk_id is the primary link to Clerk

4. Public vs. Authenticated Bookings
   - Public bookings: user_id is null
   - Authenticated bookings: user_id links to users.clerk_id
   - Both types follow same status workflow

## Type Safety Considerations

1. Status Enums
```typescript
type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type UserRole = 'admin' | 'user';
```

2. Form Types
```typescript
type BookingForm = {
  eventId: string;
  date: Date;
  name: string;
  email: string;
  phone: string;
};
```

3. Response Types
```typescript
type EventResponse = {
  events: Event[];
  error: string | null;
};
```

## Database Operations

1. Creating Bookings
   - Default status: 'pending'
   - Required fields: event_id, date, customer details
   - Optional: user_id (if authenticated)

2. Updating Status
   - Admin only for confirm/cancel
   - Status updates trigger notifications
   - Revalidate paths after updates

3. Querying Events
   - Filter by category = 'events'
   - Include status for admin views
   - Join with bookings for availability

## Migration Considerations

When modifying schema:
1. Backup existing data
2. Update TypeScript types
3. Update database schema
4. Migrate existing data
5. Update related components
6. Test all booking flows
