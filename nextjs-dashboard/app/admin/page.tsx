'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useFormState, useFormStatus } from 'react-dom'
import { updateConfig, type State } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  )
}

const initialState: State = {
  message: null,
  error: null,
}

export default function AdminPage() {
  const [state, formAction] = useFormState(updateConfig, initialState)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Brand Configuration</h1>
      
      {state.message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {state.message}
        </div>
      )}
      
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {state.error}
        </div>
      )}
      
      <form action={formAction}>
        <Tabs defaultValue="brand" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="brand">Brand Info</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="brand">
            <Card>
              <CardHeader>
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>
                  Update your brand's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input 
                    id="brand-name" 
                    name="brand.name"
                    placeholder="Enter brand name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slogan">Slogan</Label>
                  <Input 
                    id="slogan" 
                    name="brand.slogan"
                    placeholder="Enter slogan"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone-primary">Primary Phone</Label>
                    <Input 
                      id="phone-primary" 
                      name="brand.phone.primary"
                      placeholder="Primary phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-secondary">Secondary Phone</Label>
                    <Input 
                      id="phone-secondary" 
                      name="brand.phone.secondary"
                      placeholder="Secondary phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    name="brand.email"
                    placeholder="Contact email"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input 
                    name="brand.address.street"
                    placeholder="Street" 
                    className="mb-2"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Input 
                      name="brand.address.city"
                      placeholder="City" 
                    />
                    <Input 
                      name="brand.address.state"
                      placeholder="State" 
                    />
                    <Input 
                      name="brand.address.zip"
                      placeholder="ZIP" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Business Hours</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-24">Weekday:</span>
                      <Input name="brand.hours.weekday" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24">Saturday:</span>
                      <Input name="brand.hours.saturday" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24">Sunday:</span>
                      <Input name="brand.hours.sunday" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>
                  Customize your brand's color scheme
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['primary', 'secondary', 'accent', 'text'].map((color) => (
                  <div key={color} className="space-y-2">
                    <Label htmlFor={`color-${color}`}>{color.charAt(0).toUpperCase() + color.slice(1)} Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        id={`color-${color}`} 
                        name={`colors.${color}`}
                        placeholder={`${color} color hex`}
                      />
                      <Input 
                        type="color" 
                        name={`colors.${color}`}
                        className="w-12 p-1 h-10"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>
                  Manage your rental product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Trailers', 'Tables', 'Chairs', 'Party Supplies'].map((category, index) => (
                    <div key={index} className="space-y-2">
                      <Label>Category {index + 1}</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input 
                          name={`products.categories.${index}.name`}
                          placeholder="Category name"
                        />
                        <Input 
                          name={`products.categories.${index}.description`}
                          placeholder="Category description"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Configure your social media handles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['facebook', 'instagram', 'twitter'].map((platform) => (
                  <div key={platform} className="space-y-2">
                    <Label htmlFor={`social-${platform}`}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Label>
                    <Input 
                      id={`social-${platform}`} 
                      name={`social.${platform}`}
                      placeholder={`${platform} handle`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="reset" variant="outline">
            Reset Changes
          </Button>
          <SubmitButton />
        </div>
      </form>
    </div>
  )
} 