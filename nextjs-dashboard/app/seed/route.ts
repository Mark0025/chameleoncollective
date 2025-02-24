import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users, products, trailers } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

async function seedProducts() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      category VARCHAR(100) NOT NULL,
      inventory INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedProducts = await Promise.all(
    products.map(
      (product) => sql`
        INSERT INTO products (id, name, description, price, category, inventory, image_url)
        VALUES (
          ${product.id}, 
          ${product.name}, 
          ${product.description}, 
          ${product.price}, 
          ${product.category}, 
          ${product.inventory}, 
          ${product.image_url}
        )
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedProducts;
}

async function seedTrailers() {
  await sql`
    CREATE TABLE IF NOT EXISTS trailers (
      id VARCHAR(255) PRIMARY KEY,
      product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
      size VARCHAR(50) NOT NULL,
      capacity VARCHAR(50) NOT NULL,
      daily_rate INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedTrailers = await Promise.all(
    trailers.map(
      (trailer) => sql`
        INSERT INTO trailers (
          id, 
          product_id,
          size, 
          capacity, 
          daily_rate
        )
        VALUES (
          ${`tr_${trailer.id}`},
          ${trailer.id},
          ${trailer.size},
          ${trailer.capacity},
          ${trailer.daily_rate}
        )
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedTrailers;
}

async function resetTables() {
  try {
    // Drop tables in correct order (due to foreign key constraints)
    await sql`DROP TABLE IF EXISTS trailers CASCADE`;
    await sql`DROP TABLE IF EXISTS products CASCADE`;
    
    // Create tables in correct order
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        category VARCHAR(100) NOT NULL,
        inventory INTEGER NOT NULL DEFAULT 0,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS trailers (
        id VARCHAR(255) PRIMARY KEY,
        product_id VARCHAR(255) REFERENCES products(id),
        size VARCHAR(50) NOT NULL,
        capacity VARCHAR(50) NOT NULL,
        daily_rate INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    console.error('Error resetting tables:', error);
    throw error;
  }
}

export async function GET() {
  try {
    // Reset tables first
    await resetTables();

    // Insert products first
    for (const product of products) {
      await sql`
        INSERT INTO products (id, name, description, price, category, inventory, image_url)
        VALUES (
          ${product.id},
          ${product.name},
          ${product.description},
          ${product.price},
          ${product.category},
          ${product.inventory},
          ${product.image_url}
        )
      `;
    }

    // Then insert trailers
    for (const trailer of trailers) {
      await sql`
        INSERT INTO trailers (id, product_id, size, capacity, daily_rate)
        VALUES (
          ${`tr_${trailer.id}`},
          ${trailer.id},
          ${trailer.size},
          ${trailer.capacity},
          ${trailer.daily_rate}
        )
      `;
    }

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
