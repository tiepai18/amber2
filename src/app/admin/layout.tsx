import { type Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, Package, ShoppingCart, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Ambertinybear',
  description: 'Manage your Ambertinybear store.',
}

// Component điều hướng phụ cho trang Admin
function AdminNav() {
  // Trong thực tế, bạn có thể dùng `usePathname` để làm nổi bật link đang active
  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Customers', icon: Users },
  ]

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="border-b border-[#FBDBB7]/50 mb-8">
        <nav className="flex items-center gap-2 -mb-px">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              // Giả sử trang products đang active
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                link.href.includes('/products')
                  ? 'border-[#62220C] text-[#62220C]'
                  : 'border-transparent text-[#62220C]/60 hover:border-gray-300 hover:text-[#62220C]'
              }`}
            >
              <link.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default async function AdminPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin/products')
  }

  const userRole = user.app_metadata?.role

  if (userRole !== 'admin') {
    notFound() // Hiển thị trang 404 nếu không phải admin
  }

  return (
    <div className="bg-[#FEF6E4] min-h-[calc(100vh-20rem)] py-8">
      <AdminNav />
      <div className="container mx-auto px-4 md:px-6">{children}</div>
    </div>
  )
}
