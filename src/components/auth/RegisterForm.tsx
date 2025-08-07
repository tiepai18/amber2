'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { Checkbox } from '@/components/ui/checkbox'

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const acceptTerms = watch('acceptTerms')

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)

    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setIsLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-[#FBDBB7]/30 p-8 space-y-8 text-center">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center shadow-lg mb-4">
          <span className="text-4xl">💌</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#62220C]">
          Check your email
        </h1>
        <p className="text-[#62220C]/70 font-medium">
          We&apos;ve sent a verification link to your email address. Please
          click it to activate your account.
        </p>
        <Button
          onClick={() => router.push('/login')}
          className="w-full h-12 bg-gradient-to-r from-[#62220C] to-[#8B4513] text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Back to Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-[#FBDBB7]/30 p-6 md:p-8 space-y-6 relative overflow-hidden">
      {/* Header */}
      <div className="space-y-2 text-center relative z-10">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#FBDBB7] to-[#C5B5B0] rounded-full flex items-center justify-center shadow-lg mb-2">
          <span className="text-3xl">👋</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#62220C] to-[#8B4513] bg-clip-text text-transparent">
          Create an Account
        </h1>
        <p className="text-[#62220C]/70 font-medium text-sm">
          Join our cozy community of crafters!
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50/80 backdrop-blur-sm"
        >
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 relative z-10"
      >
        <div className="space-y-2">
          <Label
            htmlFor="fullName"
            className="text-[#62220C] font-medium text-sm"
          >
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Your Name"
            {...register('fullName')}
            disabled={isLoading}
            className="pl-4 h-11 w-full bg-white/60 border-[#FBDBB7] focus:border-[#C5B5B0] focus:ring-[#C5B5B0]/20 rounded-xl"
          />
          {errors.fullName && (
            <p className="text-sm text-red-600 mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#62220C] font-medium text-sm">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            {...register('email')}
            disabled={isLoading}
            className="pl-4 h-11 w-full bg-white/60 border-[#FBDBB7] focus:border-[#C5B5B0] focus:ring-[#C5B5B0]/20 rounded-xl"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-[#62220C] font-medium text-sm"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            disabled={isLoading}
            className="pl-4 h-11 w-full bg-white/60 border-[#FBDBB7] focus:border-[#C5B5B0] focus:ring-[#C5B5B0]/20 rounded-xl"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-[#62220C] font-medium text-sm"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            disabled={isLoading}
            className="pl-4 h-11 w-full bg-white/60 border-[#FBDBB7] focus:border-[#C5B5B0] focus:ring-[#C5B5B0]/20 rounded-xl"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setValue('acceptTerms', !!checked)}
            disabled={isLoading}
            className="mt-0.5"
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="acceptTerms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#62220C]/80"
            >
              I agree to the{' '}
              <Link
                href="/terms"
                className="underline text-[#62220C] hover:text-[#8B4513]"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="underline text-[#62220C] hover:text-[#8B4513]"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
        )}

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-[#62220C] to-[#8B4513] hover:from-[#4A1A09] hover:to-[#6B3410] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          disabled={isLoading}
        >
          {isLoading ? (
            <Icons.spinner className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Link to Sign In */}
      <div className="text-center text-sm relative z-10 pt-2">
        <div className="text-[#62220C]/70">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#62220C] hover:text-[#8B4513] underline-offset-4 hover:underline font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
