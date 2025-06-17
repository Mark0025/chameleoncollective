'use client'
import { useState } from 'react'
import type { Product } from '@/app/lib/definitions'

interface DashboardClientProps {
  config: any;
  dashboardData: { products: Product[] };
  userId: string | null;
}

export default function DashboardClient({ config, dashboardData, userId }: DashboardClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(dashboardData?.products?.[0] || null)
  const [form, setForm] = useState({
    cardNumber: '',
    expirationDate: '',
    cardCode: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: '',
  })
  const [amount, setAmount] = useState(selectedProduct?.price || 0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | { success: boolean; message: string }>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prod = dashboardData?.products?.find((p: Product) => p.id === e.target.value) || null;
    setSelectedProduct(prod);
    setAmount(prod?.price || 0);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: selectedProduct,
          payment: { ...form, amount },
        }),
      })
      const data = await res.json()
      if (data.success) {
        setResult({ success: true, message: `Payment successful! Transaction ID: ${data.transactionId}` })
      } else {
        setResult({ success: false, message: data.error || 'Payment failed' })
      }
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'Payment error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Checkout / Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label>Product</label>
          <select value={selectedProduct?.id || ''} onChange={handleProductChange} required>
            {dashboardData?.products?.map((p: Product) => (
              <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
            ))}
          </select>
        </div>
        <div>
          <label>Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required min={1} />
        </div>
        <div>
          <label>Card Number</label>
          <input name="cardNumber" value={form.cardNumber} onChange={handleChange} required />
        </div>
        <div>
          <label>Expiration Date (MM-YYYY)</label>
          <input name="expirationDate" value={form.expirationDate} onChange={handleChange} required />
        </div>
        <div>
          <label>CVV</label>
          <input name="cardCode" value={form.cardCode} onChange={handleChange} required />
        </div>
        <div>
          <label>First Name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div>
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} />
        </div>
        <div>
          <label>City</label>
          <input name="city" value={form.city} onChange={handleChange} />
        </div>
        <div>
          <label>State</label>
          <input name="state" value={form.state} onChange={handleChange} />
        </div>
        <div>
          <label>Zip</label>
          <input name="zip" value={form.zip} onChange={handleChange} />
        </div>
        <div>
          <label>Country</label>
          <input name="country" value={form.country} onChange={handleChange} />
        </div>
        <div>
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Pay Now'}</button>
      </form>
      {result && (
        <div className={result.success ? 'text-green-600' : 'text-red-600'}>{result.message}</div>
      )}
    </div>
  )
}
