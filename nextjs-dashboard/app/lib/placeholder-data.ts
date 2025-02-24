// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:

import { number } from "zod";
import { Product, Trailer } from './definitions';

// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

// Base products (non-trailer products)
const products: Product[] = [
  {
    id: 't1',
    name: 'Utility Trailer 4x8',
    description: 'Perfect for small hauling jobs',
    price: 149999,
    category: 'trailer',
    inventory: 3,
    image_url: '/trailers/utility-4x8.png',
  },
  {
    id: 't2',
    name: 'Enclosed Trailer 6x12',
    description: 'Weather-protected cargo space',
    price: 299999,
    category: 'trailer',
    inventory: 2,
    image_url: '/trailers/enclosed-6x12.png',
  },
  {
    id: 't3',
    name: 'Car Hauler 18ft',
    description: 'Professional auto transport trailer',
    price: 499999,
    category: 'trailer',
    inventory: 2,
    image_url: '/trailers/car-hauler-18.png',
  },
];

// Trailer products
const trailers: Trailer[] = [
  {
    id: 't1',
    name: 'Utility Trailer 4x8',
    description: 'Perfect for small hauling jobs',
    price: 149999,
    category: 'trailer',
    inventory: 3,
    image_url: '/trailers/utility-4x8.png',
    size: '4x8',
    capacity: '1000',
    daily_rate: 2500,
  },
  {
    id: 't2',
    name: 'Enclosed Trailer 6x12',
    description: 'Weather-protected cargo space',
    price: 299999,
    category: 'trailer',
    inventory: 2,
    image_url: '/trailers/enclosed-6x12.png',
    size: '6x12',
    capacity: '2500',
    daily_rate: 5500,
  },
  {
    id: 't3',
    name: 'Car Hauler 18ft',
    description: 'Professional auto transport trailer',
    price: 499999,
    category: 'trailer',
    inventory: 2,
    image_url: '/trailers/car-hauler-18.png',
    size: '18ft',
    capacity: '7000',
    daily_rate: 8500,
  },
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/customers/balazs-orban.png',
  },
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    customer_id: customers[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
  },
  {
    customer_id: customers[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
  },
  {
    customer_id: customers[2].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
  },
  {
    customer_id: customers[0].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
  },
  {
    customer_id: customers[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
  },
  {
    customer_id: customers[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
  },
  {
    customer_id: customers[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
  },
  {
    customer_id: customers[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
  },
  {
    customer_id: customers[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
  },
  {
    customer_id: customers[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
  },
];

const revenue = [
  { month: 'Jan', revenue: 200000 }, // Store in cents
  { month: 'Feb', revenue: 180000 },
  { month: 'Mar', revenue: 220000 },
  { month: 'Apr', revenue: 250000 },
  { month: 'May', revenue: 230000 },
  { month: 'Jun', revenue: 320000 },
  { month: 'Jul', revenue: 350000 },
  { month: 'Aug', revenue: 370000 },
  { month: 'Sep', revenue: 250000 },
  { month: 'Oct', revenue: 280000 },
  { month: 'Nov', revenue: 300000 },
  { month: 'Dec', revenue: 480000 },
];

const bookings = [
  {
    id: 'book_1',
    event_id: 'evt_balloon',
    date: new Date('2025-03-15'),
    customer_name: 'John Smith',
    customer_email: 'john@example.com',
    customer_phone: '555-0123',
    created_at: new Date('2025-02-24'),
    status: 'confirmed'
  },
  {
    id: 'book_2',
    event_id: 'evt_tent',
    date: new Date('2025-03-20'),
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah@example.com',
    customer_phone: '555-0124',
    created_at: new Date('2025-02-24'),
    status: 'pending'
  },
  {
    id: 'book_3',
    event_id: 'evt_bar_min',
    date: new Date('2025-04-01'),
    customer_name: 'Mike Wilson',
    customer_email: 'mike@example.com',
    customer_phone: '555-0125',
    created_at: new Date('2025-02-24'),
    status: 'confirmed'
  }
];

export { users, customers, products, trailers, invoices, revenue, bookings };
