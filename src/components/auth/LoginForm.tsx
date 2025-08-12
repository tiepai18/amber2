'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Validate redirect URL to prevent open redirect vulnerability
  const redirectParam = searchParams.get('redirectTo')
  const redirectTo =
    redirectParam &&
    redirectParam.startsWith('/') &&
    !redirectParam.startsWith('//')
      ? redirectParam
      : '/profile'

  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    return () => {
      setIsLoading(false)
      setError(null)
    }
  }, [])

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
      }
      // Note: If successful, the user will be redirected to Google OAuth flow
      // The loading state will be reset when they return or the component unmounts
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-[#FBDBB7]/30 p-6 md:p-8 space-y-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 text-6xl">🧶</div>
        <div className="absolute top-12 right-8 text-4xl">🪡</div>
        <div className="absolute bottom-8 left-8 text-5xl">🐻</div>
        <div className="absolute bottom-4 right-4 text-3xl">💕</div>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center relative z-10">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#FBDBB7] to-[#C5B5B0] rounded-full flex items-center justify-center shadow-lg mb-2">
          <span className="text-3xl">🧸</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#62220C] to-[#8B4513] bg-clip-text text-transparent">
          Welcome Back!
        </h1>
        <p className="text-[#62220C]/70 font-medium text-sm">
          Ready to continue your crafting journey? ✨
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50/80 backdrop-blur-sm relative z-10"
        >
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Login Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 relative z-10"
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#62220C] font-medium text-sm">
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              disabled={isLoading}
              className="pl-10 h-11 w-full bg-white/60 border-[#FBDBB7] focus:border-[#C5B5B0] focus:ring-[#C5B5B0]/20 rounded-xl transition-all duration-200 hover:bg-white/80"
              autoComplete="email"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#62220C]/40">
              📧
            </div>
          </div>
          {errors.email && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
              <span>⚠️</span>
              <p>{errors.email.message}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-[#62220C] font-medium text-sm"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
              className="pl-10 h-11 w-full bg-white/60 border-[#FBDBB7] focus:border-[#C5B5B0] focus:ring-[#C5B5B0]/20 rounded-xl transition-all duration-200 hover:bg-white/80"
              autoComplete="current-password"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#62220C]/40">
              🔒
            </div>
          </div>
          {errors.password && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
              <span>⚠️</span>
              <p>{errors.password.message}</p>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-[#62220C] to-[#8B4513] hover:from-[#4A1A09] hover:to-[#6B3410] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Icons.spinner className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>✨</span>
              <span>Sign In</span>
            </div>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#FBDBB7]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-[#62220C]/60 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Sign-In Button */}
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={signInWithGoogle}
        className="w-full h-11 flex items-center justify-center gap-2 border-[#FBDBB7] hover:bg-[#FBDBB7]/20 rounded-xl transition-all duration-200 hover:shadow-md relative z-10"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        <span className="text-[#62220C] font-medium">Continue with Google</span>
      </Button>

      {/* Other Links */}
      <div className="space-y-3 text-center text-sm relative z-10">
        <Link
          href="/forgot-password"
          className="block text-[#62220C] hover:text-[#8B4513] underline-offset-4 hover:underline transition-colors duration-200 font-medium"
        >
          🤔 Forgot your password?
        </Link>

        <div className="text-[#62220C]/70">
          New to our cozy community?{' '}
          <Link
            href="/register"
            className="text-[#62220C] hover:text-[#8B4513] underline-offset-4 hover:underline font-medium transition-colors duration-200"
          >
            Join us! 🎨
          </Link>
        </div>
      </div>
    </div>
  )
}
