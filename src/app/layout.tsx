import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/hooks/useAuth'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ambertinybear | Handmade with Love',
  description:
    'Discover unique crochet creations, patterns, and kits. Handmade happiness, stitched with love.',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-[#62220C]`}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
