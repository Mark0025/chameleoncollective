'use server'

import { sql } from '@/app/lib/db'
import { revalidatePath } from 'next/cache'

interface DBProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  inventory: number;
  image_url: string;
  available: boolean;
}

export async function getProducts() {
  try {
    const result = await sql<DBProduct[]>`
      SELECT 
        id,
        name,
        price,
        description,
        category,
        inventory,
        image_url,
        available
      FROM products
      ORDER BY name ASC
    `

    const products = result.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      inventory: product.inventory,
      image: product.image_url,
      available: product.available
    }))

    return { products, error: null }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { products: [], error: 'Failed to fetch products' }
  }
}

interface CreateProductData {
  name: string;
  price: number;
  description: string;
  category: string;
  inventory: number;
  image_url: string;
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get('name')
    const price = formData.get('price')
    const description = formData.get('description')
    const category = formData.get('category')
    const inventory = formData.get('inventory')
    const image_url = formData.get('image_url')

    if (!name || !price || !description || !category || !inventory || !image_url) {
      return { success: false, error: 'Missing required fields' }
    }

    const data: CreateProductData = {
      name: name.toString(),
      price: parseFloat(price.toString()),
      description: description.toString(),
      category: category.toString(),
      inventory: parseInt(inventory.toString()),
      image_url: image_url.toString()
    }

    await sql`
      INSERT INTO products (
        name,
        price,
        description,
        category,
        inventory,
        image_url,
        available
      ) VALUES (
        ${data.name},
        ${data.price},
        ${data.description},
        ${data.category},
        ${data.inventory},
        ${data.image_url},
        ${data.inventory > 0}
      )
    `

    revalidatePath('/admin/products')
    return { success: true, error: null }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Failed to create product' }
  }
}
