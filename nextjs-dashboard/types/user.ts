export type UserRole = 'admin' | 'customer' | 'guest'

export interface UserMetadata {
  role?: UserRole;
  customerId?: string;
  lastVisit?: string;
  totalVisits?: number;
  hasBooked?: boolean;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  available: boolean;
  price: number;
  inventory: number;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Event {
  id: number;
  title: string;
  date: Date;
  type: 'wedding' | 'birthday' | 'corporate' | 'other';
  status: 'confirmed' | 'pending' | 'cancelled';
  customer: string;
  revenue: number;
  items: string[];
  userId: string;
}

export interface Rental {
  id: number;
  itemName: string;
  image: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'upcoming' | 'completed' | 'overdue';
  price: number;
  rentalDays: number;
  itemId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
} 