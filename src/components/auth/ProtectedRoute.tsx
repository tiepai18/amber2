'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Icons } from '@/components/ui/icons'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  fallback,
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push('/login')
        return
      }

      if (requireAdmin && profile?.role !== 'admin') {
        router.push('/unauthorized')
        return
      }

      setIsChecking(false)
    }
  }, [user, profile, loading, requireAuth, requireAdmin, router])

  if (loading || isChecking) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      )
    )
  }

  if (requireAuth && !user) {
    return null
  }

  if (requireAdmin && profile?.role !== 'admin') {
    return null
  }

  return <>{children}</>
}
