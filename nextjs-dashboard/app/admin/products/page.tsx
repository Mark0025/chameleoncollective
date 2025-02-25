'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getProducts } from './actions'
import type { Product } from '@/types/product'

export default function AdminProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const result = await getProducts()
        if (result.error) {
          setError(result.error)
        } else {
          setProducts(result.products)
        }
      } catch (err) {
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      // TODO: Implement updateProduct server action
      setProducts(products.map(product => 
        product.id === id ? { ...product, ...updates } : product
      ))
    } catch (err) {
      console.error('Failed to update product:', err)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#2C363F]">Manage Products</h1>
        <Button 
          className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
          onClick={() => router.push('/admin/products/create')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="trailers">Trailers</SelectItem>
            <SelectItem value="tables">Tables</SelectItem>
            <SelectItem value="chairs">Chairs</SelectItem>
            <SelectItem value="party-supplies">Party Supplies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">No products found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden border border-[#235082]/20">
            <div className="relative h-48 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-[#2C363F]">{product.name}</h3>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Price (USD)</label>
                    <Input
                      type="number"
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, { price: parseFloat(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Inventory</label>
                    <Input
                      type="number"
                      value={product.inventory}
                      onChange={(e) => updateProduct(product.id, { 
                        inventory: parseInt(e.target.value),
                        available: parseInt(e.target.value) > 0
                      })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className={`text-sm ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                    {product.available ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Category: {product.category}
                  </span>
                </div>
              </div>
            </CardContent>
        </Card>
      ))}
    </div>
      )}
    </div>
  )
}
