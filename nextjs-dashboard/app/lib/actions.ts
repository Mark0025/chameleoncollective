'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { Product, Trailer } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

// export async function authenticate(
//   prevState: string | undefined,
//   formData: FormData,
// ) {
//   try {
//     await signIn('credentials', formData);
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           return 'Invalid credentials.';
//         default:
//           return 'Something went wrong.';
//       }
//     }
//     throw error;
//   }
// }

// Base Product Schema
const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string(),
  price: z.coerce.number().min(0, 'Price must be greater than $0'),
  category: z.string().min(1, 'Category is required'),
  inventory: z.coerce.number().min(0, 'Inventory must be 0 or greater'),
  image_url: z.string().optional(),
});

// Trailer Schema extends ProductSchema
const TrailerSchema = ProductSchema.extend({
  size: z.string().min(1, 'Size is required'),
  capacity: z.string().min(1, 'Capacity is required'),
  daily_rate: z.coerce.number().min(0, 'Daily rate must be greater than $0'),
});

// First, create the tables if they don't exist
export async function createTables() {
  try {
    // Create products table
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

    // Create trailers table that extends products
    await sql`
      CREATE TABLE IF NOT EXISTS trailers (
        id VARCHAR(255) PRIMARY KEY,
        product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
        size VARCHAR(50) NOT NULL,
        capacity VARCHAR(50) NOT NULL,
        daily_rate INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_product_category ON products(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_trailer_product ON trailers(product_id)`;

    // Create rentals table
    await sql`
      CREATE TABLE IF NOT EXISTS rentals (
        id VARCHAR(255) PRIMARY KEY,
        trailer_id VARCHAR(255) REFERENCES trailers(id),
        customer_id VARCHAR(255) REFERENCES customers(id),
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        status VARCHAR(50) NOT NULL,
        daily_rate INTEGER NOT NULL,
        total_cost INTEGER NOT NULL,
        security_deposit INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Add new columns to trailers table
    await sql`
      ALTER TABLE trailers
      ADD COLUMN IF NOT EXISTS rental_status VARCHAR(50) DEFAULT 'available',
      ADD COLUMN IF NOT EXISTS security_deposit INTEGER NOT NULL DEFAULT 10000,
      ADD COLUMN IF NOT EXISTS maintenance_notes TEXT
    `;

  } catch (error) {
    console.error('Error creating tables:', error);
    throw new Error('Failed to create tables.');
  }
}

// Create a new product
export async function createProduct(formData: FormData) {
  const productId = `p_${Date.now()}`;
  
  try {
    const { name, description, price, category, inventory } = ProductSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      category: formData.get('category'),
      inventory: formData.get('inventory'),
    });

    // Handle image upload
    const imageFile = formData.get('image') as File;
    let image_url = '';
    
    if (imageFile && imageFile.size > 0) {
      // For now, we'll just store the image in the public folder
      // In a real app, you'd want to use a proper storage service like S3
      const fileName = `${productId}-${imageFile.name}`;
      const filePath = `/images/${fileName}`;
      
      // Save the file to the public folder
      // Note: This is a simplified example. In production, use proper file storage
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fs = require('fs').promises;
      await fs.writeFile(`public${filePath}`, buffer);
      
      image_url = filePath;
    }

    console.log('Creating product:', { 
      productId, 
      name, 
      description, 
      price, 
      category, 
      inventory,
      image_url 
    });

    await sql`
      INSERT INTO products (id, name, description, price, category, inventory${
        image_url ? ', image_url' : ''
      })
      VALUES (${productId}, ${name}, ${description}, ${price}, ${category}, ${inventory}${
        image_url ? `, ${image_url}` : ''
      })
    `;

    console.log('Product created successfully:', productId);
    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
    
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      message: 'Database Error: Failed to Create Product.',
    };
  }
}

// Update an existing product
export async function updateProduct(id: string, formData: FormData) {
  try {
    const { name, description, price, category, inventory } = ProductSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      category: formData.get('category'),
      inventory: formData.get('inventory'),
    });

    // Handle image upload
    const imageFile = formData.get('image') as File;
    let image_url = undefined; // undefined means no change to existing image
    
    if (imageFile && imageFile.size > 0) {
      const fileName = `${id}-${imageFile.name}`;
      const filePath = `/images/${fileName}`;
      
      // Save the file
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fs = require('fs').promises;
      await fs.writeFile(`public${filePath}`, buffer);
      
      image_url = filePath;
    }

    // Only include image_url in update if it changed
    const updateFields = [
      `name = ${name}`,
      `description = ${description}`,
      `price = ${price}`,
      `category = ${category}`,
      `inventory = ${inventory}`,
      ...(image_url ? [`image_url = ${image_url}`] : []),
    ].join(', ');

    await sql`
      UPDATE products
      SET ${sql(updateFields)}
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
    
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      message: 'Database Error: Failed to Update Product.',
    };
  }
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/dashboard/products');
    return { message: 'Product Deleted Successfully' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Product.',
    };
  }
}

// Fetch a single product
export async function fetchProduct(id: string) {
  try {
    const result = await sql<{
      id: string;
      name: string;
      description: string;
      price: number;
      category: string;
      inventory: number;
    }[]>`
      SELECT * FROM products WHERE id = ${id}
    `;
    return result[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

// Update the createTrailer function to handle the relationship
export async function createTrailer(formData: FormData) {
  const validatedFields = TrailerSchema.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    category: 'trailer', // Always 'trailer' for trailers
    inventory: formData.get('inventory'),
    size: formData.get('size'),
    capacity: formData.get('capacity'),
    daily_rate: formData.get('daily_rate'),
    image_url: formData.get('image_url') || '',
  });

  try {
    // First, create the base product
    const [product] = await sql`
      INSERT INTO products (
        id,
        name,
        description,
        price,
        category,
        inventory${
          validatedFields.image_url ? ', image_url' : ''
        }
      ) VALUES (
        ${`t_${Date.now()}`},
        ${validatedFields.name},
        ${validatedFields.description},
        ${validatedFields.price},
        ${validatedFields.category},
        ${validatedFields.inventory}${
          validatedFields.image_url ? `, ${validatedFields.image_url}` : ''
        }
      )
      RETURNING id
    `;

    // Then create the trailer with reference to the product
    await sql`
      INSERT INTO trailers (
        id,
        product_id,
        size,
        capacity,
        daily_rate
      ) VALUES (
        ${`tr_${Date.now()}`},
        ${product.id},
        ${validatedFields.size},
        ${validatedFields.capacity},
        ${validatedFields.daily_rate}
      )
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Trailer.',
    };
  }

  revalidatePath('/dashboard/trailers');
  redirect('/dashboard/trailers');
}

// Update the updateTrailer function similarly
export async function updateTrailer(id: string, formData: FormData) {
  const validatedFields = TrailerSchema.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    category: 'trailer',
    inventory: formData.get('inventory'),
    size: formData.get('size'),
    capacity: formData.get('capacity'),
    daily_rate: formData.get('daily_rate'),
    image_url: formData.get('image_url') || '',
  });

  try {
    await sql`
      UPDATE products
      SET 
        name = ${validatedFields.name},
        description = ${validatedFields.description},
        price = ${validatedFields.price},
        inventory = ${validatedFields.inventory}${
          validatedFields.image_url ? `, image_url = ${validatedFields.image_url}` : ''
        }
      WHERE id = ${id}
    `;

    await sql`
      UPDATE trailers
      SET 
        size = ${validatedFields.size},
        capacity = ${validatedFields.capacity},
        daily_rate = ${validatedFields.daily_rate}
      WHERE product_id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Trailer.',
    };
  }

  revalidatePath('/dashboard/trailers');
  redirect('/dashboard/trailers');
}
