'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Filter } from 'lucide-react'
import { useState } from 'react'

const RENTAL_ITEMS = [
  {
    category: "Trailers",
    items: [
      {
        name: "Utility Trailer",
        description: "5x8 utility trailer, perfect for small moves",
        price: "45/day",
        image: "/images/product-imgs/trailers/small-trailer.png",
        available: true
      },
      {
        name: "16ft Tandem Axle",
        description: "16ft car hauler with ramps",
        price: "75/day",
        image: "/images/product-imgs/trailers/16ft-tandem-axel.png",
        available: true
      },
      {
        name: "16ft Enclosed Trailer",
        description: "16ft enclosed trailer for secure transport",
        price: "95/day",
        image: "/images/product-imgs/trailers/enclosed-16-ft.png",
        available: true
      }
    ]
  },
  {
    category: "Tables",
    items: [
      {
        name: "6ft Banquet Table",
        description: "Rectangle folding table, seats 6-8",
        price: "12/day",
        image: "/images/product-imgs/table.jpg",
        available: true
      },
      {
        name: "Round Table",
        description: "60\" round table, seats 8",
        price: "15/day",
        image: "/images/product-imgs/table.jpg",
        available: true
      }
    ]
  },
  {
    category: "Chairs",
    items: [
      {
        name: "Folding Chair",
        description: "White plastic folding chair",
        price: "2/day",
        image: "/images/product-imgs/chair.jpg",
        available: true
      },
      {
        name: "Chiavari Chair",
        description: "Gold chiavari chair with cushion",
        price: "8/day",
        image: "/images/product-imgs/chair.jpg",
        available: true
      }
    ]
  },
  {
    category: "Party Supplies",
    items: [
      {
        name: "Balloon Arch Kit",
        description: "100pc balloon arch with stand",
        price: "75/event",
        image: "/images/product-imgs/ballons.jpg",
        available: true
      },
      {
        name: "Table Linens",
        description: "90x132 rectangle tablecloth",
        price: "15/each",
        image: "/images/product-imgs/ballons.jpg",
        available: true
      }
    ]
  }
]

export default function RentalsStorefront() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredCategories = RENTAL_ITEMS.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category =>
    selectedCategory === 'all' || category.category.toLowerCase() === selectedCategory.toLowerCase()
  )

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#2C363F] mb-4">Available Rentals</h1>
        <p className="text-lg text-[#2C363F]/60">
          Browse our selection of quality rental items for your next event
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search rentals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {RENTAL_ITEMS.map(category => (
              <SelectItem key={category.category} value={category.category.toLowerCase()}>
                {category.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories and Items */}
      <div className="space-y-12">
        {filteredCategories.map((category) => (
          category.items.length > 0 && (
            <section key={category.category}>
              <h2 className="text-2xl font-semibold mb-6">{category.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <Card key={item.name} className={item.available ? "" : "opacity-60"}>
                    <div className="relative h-48 w-full">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <span className="text-lg font-normal">${item.price}</span>
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                          {item.available ? 'Available' : 'Currently Rented'}
                        </span>
                        <SignedIn>
                          <Button 
                            className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
                            disabled={!item.available}
                          >
                            Book Now
                          </Button>
                        </SignedIn>
                        <SignedOut>
                          <SignInButton mode="modal">
                            <Button 
                              className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
                              disabled={!item.available}
                            >
                              Sign in to Book
                            </Button>
                          </SignInButton>
                        </SignedOut>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )
        ))}
      </div>
    </div>
  )
} 