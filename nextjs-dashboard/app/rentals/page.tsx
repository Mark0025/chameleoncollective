'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"

const RENTAL_ITEMS = [
  {
    category: "Trailers",
    items: [
      {
        name: "Utility Trailer",
        description: "5x8 utility trailer, perfect for small moves",
        price: "45/day",
        image: "/trailers/utility.jpg",
        available: true
      },
      {
        name: "Car Trailer",
        description: "16ft car hauler with ramps",
        price: "75/day",
        image: "/trailers/car.jpg",
        available: false
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
        image: "/tables/banquet.jpg",
        available: true
      },
      {
        name: "Round Table",
        description: "60\" round table, seats 8",
        price: "15/day",
        image: "/tables/round.jpg",
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
        image: "/chairs/folding.jpg",
        available: true
      },
      {
        name: "Chiavari Chair",
        description: "Gold chiavari chair with cushion",
        price: "8/day",
        image: "/chairs/chiavari.jpg",
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
        image: "/party/balloon-arch.jpg",
        available: true
      },
      {
        name: "Table Linens",
        description: "90x132 rectangle tablecloth",
        price: "15/each",
        image: "/party/linens.jpg",
        available: true
      }
    ]
  }
]

export default function RentalsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Available Rentals</h1>
      
      <div className="space-y-12">
        {RENTAL_ITEMS.map((category) => (
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
                        <Button disabled={!item.available}>
                          {item.available ? 'Reserve Now' : 'Not Available'}
                        </Button>
                      </SignedIn>
                      <SignedOut>
                        <SignInButton mode="modal">
                          <Button variant="outline">
                            Sign in to Reserve
                          </Button>
                        </SignInButton>
                      </SignedOut>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
} 