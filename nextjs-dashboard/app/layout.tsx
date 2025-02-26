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

  if (!publishableKey) {
    // During static build, return minimal layout
    return (
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
