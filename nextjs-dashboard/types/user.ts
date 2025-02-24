export type UserRole = 'admin' | 'customer'

export interface UserMetadata {
  role: UserRole;
  customerId?: string;
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