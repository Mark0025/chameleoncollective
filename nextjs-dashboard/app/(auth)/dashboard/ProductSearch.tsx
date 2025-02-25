'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { Plus } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'trailers', name: 'Trailers' },
  { id: 'tables', name: 'Tables' },
  { id: 'chairs', name: 'Chairs' },
  { id: 'party-supplies', name: 'Party Supplies' },
]

const SAMPLE_PRODUCTS = {
  trailers: [
    { id: 1, name: 'Small Utility Trailer', image: '/images/product-imgs/trailers/small-trailer.png', available: true },
    { id: 2, name: '16ft Tandem Axle', image: '/images/product-imgs/trailers/16ft-tandem-axel.png', available: false },
    { id: 3, name: '16ft Enclosed Trailer', image: '/images/product-imgs/trailers/enclosed-16-ft.png', available: true },
  ],
  tables: [
    { id: 4, name: '6ft Banquet Table', image: '/images/product-imgs/table.jpg', available: true },
  ],
  chairs: [
    { id: 5, name: 'Folding Chair', image: '/images/product-imgs/chair.jpg', available: true },
  ],
  'party-supplies': [
    { id: 6, name: 'Balloon Arch Kit', image: '/images/product-imgs/ballons.jpg', available: true },
  ],
}

interface ProductSearchProps {
  isAdmin: boolean;
}

export default function ProductSearch({ isAdmin }: ProductSearchProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = Object.entries(SAMPLE_PRODUCTS)
    .flatMap(([category, products]) => {
      if (selectedCategory === 'all' || selectedCategory === category) {
        return products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      return []
    })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#2C363F]">Products</h1>
        {isAdmin && (
          <Button className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Product
          </Button>
        )}
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
            {CATEGORIES.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-[#2C363F]">{product.name}</h3>
                <Button
                  variant={product.available ? "default" : "outline"}
                  className={product.available ? "bg-[#FF6B6B] hover:bg-[#FF6B6B]/90" : "text-gray-500"}
                  disabled={!product.available}
                >
                  {product.available ? 'Reserve' : 'Not Available'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 