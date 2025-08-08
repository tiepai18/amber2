'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { user, profile, refreshProfile } = useAuth()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    // Initialize with empty/default values to prevent issues on first render
    defaultValues: {
      fullName: '',
      phone: '',
      dateOfBirth: undefined,
      gender: 'none',
    },
  })

  // FIX: Use useEffect to safely populate the form once the `profile` data is available.
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        // Safely convert the date string from the database into a Date object
        dateOfBirth: profile.date_of_birth
          ? new Date(profile.date_of_birth)
          : undefined,
        gender: (profile.gender as UpdateProfileInput['gender']) || 'none',
      })
    }
  }, [profile, reset])

  const gender = watch('gender')

  const onSubmit = async (data: UpdateProfileInput) => {
    if (!user) return

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          phone: data.phone || null,
          // FIX: Convert the Date object from the form back to an ISO string for Supabase
          date_of_birth: data.dateOfBirth
            ? data.dateOfBirth.toISOString()
            : null,
          gender: data.gender === 'none' ? null : data.gender,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      await refreshProfile()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to upload avatar.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setIsLoading(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: `${publicUrl}?t=${new Date().getTime()}` })
        .eq('id', user.id)

      if (updateError) throw updateError

      await refreshProfile()
      setSuccess(true)
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to upload avatar.')
    } finally {
      setIsLoading(false)
    }
  }

  const initials =
    profile?.full_name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'U'

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-[#FBDBB7]/30 p-6 md:p-8 space-y-8">
      <h2 className="text-2xl font-bold text-[#62220C]">
        Personal Information
      </h2>

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50/80">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default" className="border-green-200 bg-green-50/80">
          <Icons.checkCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Profile updated successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#FBDBB7]/20 rounded-2xl">
        <Avatar className="h-24 w-24 border-4 border-white shadow-md">
          <AvatarImage
            src={profile?.avatar_url || ''}
            alt={profile?.full_name || ''}
          />
          <AvatarFallback className="text-3xl bg-[#C5B5B0] text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <Label
            htmlFor="avatar"
            className="cursor-pointer inline-block px-4 py-2 bg-gradient-to-r from-[#62220C] to-[#8B4513] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isLoading ? 'Uploading...' : 'Change Avatar'}
          </Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
            disabled={isLoading}
          />
          <p className="text-sm text-[#62220C]/70 mt-2">
            JPG, PNG, GIF. Max 2MB.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-[#62220C] font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              {...register('fullName')}
              disabled={isLoading}
              className="h-11 bg-white/60 border-[#FBDBB7] rounded-xl"
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#62220C] font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              disabled={isLoading}
              className="h-11 bg-white/60 border-[#FBDBB7] rounded-xl"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-[#62220C] font-medium">
              Date of Birth
            </Label>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal h-11 bg-white/60 border-[#FBDBB7] rounded-xl hover:bg-white/80',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      // FIX: `selected` prop expects a Date object, which `field.value` already is.
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-600">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-[#62220C] font-medium">
              Gender
            </Label>
            <Select
              value={gender}
              onValueChange={(value) =>
                setValue('gender', value as UpdateProfileInput['gender'])
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 bg-white/60 border-[#FBDBB7] rounded-xl">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Prefer not to say</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-600">{errors.gender.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[#62220C] font-medium">Email</Label>
          <Input
            type="email"
            value={user?.email || ''}
            disabled
            className="h-11 bg-[#FBDBB7]/30 border-[#C5B5B0] rounded-xl cursor-not-allowed"
          />
          <p className="text-sm text-[#62220C]/70">Email cannot be changed.</p>
        </div>
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 px-6 bg-gradient-to-r from-[#62220C] to-[#8B4513] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  )
}
