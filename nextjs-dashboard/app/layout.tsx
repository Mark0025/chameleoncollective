import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SignUp from '@/components/shared/signUp'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Amanda Party & Event Rentals',
    description: 'Signup for Amanda Party & Event Rentals',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="bg-black">
            <body className={`${inter.className} bg-black min-h-screen`}>
                <SignUp />
                {children}
            </body>
        </html>
    )
}
