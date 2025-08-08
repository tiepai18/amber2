'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons' // Assuming you have an Icons object
import { Skeleton } from '@/components/ui/skeleton' // For loading state

export function UserMenu() {
  const { user, profile, signOut, loading } = useAuth()

  // Show a loading skeleton while the auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    )
  }

  // If the user is not logged in, show Sign In and Sign Up buttons
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          asChild
          className="text-[#62220C] hover:bg-[#FBDBB7]/50"
        >
          <Link href="/login">Sign In</Link>
        </Button>
        <Button asChild className="bg-[#62220C] text-white hover:bg-[#8B4513]">
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    )
  }

  // Calculate user initials for the avatar fallback
  const initials =
    profile?.full_name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-transparent hover:border-[#FBDBB7]">
            <AvatarImage
              src={profile?.avatar_url || ''}
              alt={profile?.full_name || ''}
            />
            <AvatarFallback className="bg-[#C5B5B0] text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-[#62220C]">
              {profile?.full_name || 'New Crafter'}
            </p>
            <p className="text-xs leading-none text-[#62220C]/70">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <Icons.user className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders" className="cursor-pointer">
            <Icons.package className="mr-2 h-4 w-4" />
            <span>My Orders</span>
          </Link>
        </DropdownMenuItem>

        {/* Conditionally render the Admin Dashboard link */}
        {profile?.role === 'admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard" className="cursor-pointer">
                <Icons.settings className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signOut}
          className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
        >
          <Icons.logOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
