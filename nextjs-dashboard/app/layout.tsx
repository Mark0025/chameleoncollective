import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/app/lib/brand/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {publishableKey ? (
          <ClerkProvider publishableKey={publishableKey}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
            <Toaster />
          </ClerkProvider>
        ) : (
          <ThemeProvider>
            {children}
          </ThemeProvider>
        )}
      </body>
    </html>
  );
}
