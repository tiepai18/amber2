'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // This function can be called from other components to manually refresh the profile
  const refreshProfile = async () => {
    // It's safer to get the user again to ensure the session is still valid
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setProfile(null)
      return
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(profileData)
  }

  useEffect(() => {
    // onAuthStateChange automatically runs on initialization with the current session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      // If there's a user, fetch their profile
      if (currentUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
        setProfile(profileData)
      } else {
        // If the user signs out, clear the profile
        setProfile(null)
      }

      setLoading(false)
    })

    // Unsubscribe from the listener when the component unmounts
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase]) // This effect should only run once

  const signOut = async () => {
    await supabase.auth.signOut()
    // No need to manually set user/profile to null,
    // onAuthStateChange will handle it automatically.
  }

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
