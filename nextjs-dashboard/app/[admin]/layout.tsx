'use client'

import { useAuth } from "@clerk/nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import SideNav from '@/components/dashboard/sidenav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to home
    if (isLoaded && !userId) {
      router.push('/')
      return
    }

    // TODO: Add admin role check here
    // For now, we'll use a placeholder check. You should implement proper role checking
    const checkAdminRole = async () => {
      try {
        // This should be replaced with your actual admin role check
        const isAdmin = false // Replace with actual admin check
        if (!isAdmin) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Failed to check admin role:', error)
        router.push('/dashboard')
      }
    }

    if (userId) {
      checkAdminRole()
    }
  }, [isLoaded, userId, router])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  )
} 