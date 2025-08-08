'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { Button } from '../ui/button'

const navItems = [
  { href: '/profile', label: 'My Profile', icon: Icons.user },
  { href: '/orders', label: 'My Orders', icon: Icons.package },
  { href: '/addresses', label: 'Address Book', icon: Icons.book },
  { href: '/wishlist', label: 'My Wishlist', icon: Icons.heart },
]

export function ProfileSidebar() {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()

  const initials =
    profile?.full_name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'U'

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-[#FBDBB7]/30 p-6 flex flex-col h-full">
      <div className="flex flex-col items-center text-center pb-6 border-b border-[#FBDBB7]/50">
        <Avatar className="h-20 w-20 mb-4 border-4 border-white shadow-md">
          <AvatarImage
            src={profile?.avatar_url || ''}
            alt={profile?.full_name || ''}
          />
          <AvatarFallback className="text-2xl bg-[#C5B5B0] text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-bold text-lg text-[#62220C]">
          {profile?.full_name || 'New Crafter'}
        </h3>
        <p className="text-sm text-[#62220C]/70">{user?.email}</p>
      </div>
      <nav className="flex-grow mt-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
              pathname === item.href
                ? 'bg-[#FBDBB7]/50 text-[#62220C] font-bold'
                : 'text-[#62220C]/80 hover:bg-[#FBDBB7]/30 hover:text-[#62220C]'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-6 pt-6 border-t border-[#FBDBB7]/50">
        <Button
          onClick={signOut}
          variant="ghost"
          className="w-full justify-start flex items-center gap-3 px-4 py-3 text-[#62220C]/80 hover:bg-red-50 hover:text-red-700 rounded-xl"
        >
          <Icons.logOut className="h-5 w-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  )
}
