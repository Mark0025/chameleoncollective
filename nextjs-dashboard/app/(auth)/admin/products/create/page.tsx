'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct } from '../actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"

export default function CreateProduct() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await createProduct(formData)

      if (!result.success) {
        setError(result.error || 'Failed to create product')
        return
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#2C363F] mb-8">Create New Product</h1>

      <Card className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <Input
              name="name"
              required
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              name="description"
              required
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price (USD)</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Inventory</label>
              <Input
                name="inventory"
                type="number"
                min="0"
                required
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trailers">Trailers</SelectItem>
                <SelectItem value="tables">Tables</SelectItem>
                <SelectItem value="chairs">Chairs</SelectItem>
                <SelectItem value="party-supplies">Party Supplies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <Input
              name="image_url"
              required
              placeholder="Enter image URL"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#235082] hover:bg-[#235082]/90"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
