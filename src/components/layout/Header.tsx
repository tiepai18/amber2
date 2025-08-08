'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, Heart, ShoppingBag, Menu } from 'lucide-react'
import { UserMenu } from '@/components/auth/UserMenu' // Giả sử bạn đã có component này
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet' // Dùng cho menu mobile
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/patterns', label: 'Patterns' },
  { href: '/kits', label: 'Crochet Kits' },
  { href: '/about', label: 'About Us' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#FBDBB7]/50 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.webp"
            alt="The Crochet Corner Logo"
            width={40}
            height={40}
          />
          <span className="hidden text-xl font-bold text-[#62220C] sm:inline-block">
            The Crochet Corner
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#62220C]/80 transition-colors hover:text-[#62220C]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions & User Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex text-[#62220C]/80 hover:text-[#62220C]"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/wishlist">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex text-[#62220C]/80 hover:text-[#62220C]"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#62220C]/80 hover:text-[#62220C]"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>

          <div className="hidden md:block">
            <UserMenu />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-[#62220C]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-6 text-lg font-medium mt-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-[#62220C]/80 transition-colors hover:text-[#62220C]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
