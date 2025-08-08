import { type Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileSidebar } from '@/components/auth/ProfileSidebar'
import { ProfileForm } from '@/components/auth/ProfileForm'

export const metadata: Metadata = {
  title: 'My Profile | The Crochet Corner',
  description: 'Manage your account settings and personal information.',
}

export default async function ProfilePage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login?redirectTo=/profile')
  }

  return (
    <div
      className="w-full min-h-screen p-4 sm:p-6 md:p-8"
      style={{ backgroundColor: '#FEF6E4' }}
    >
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#62220C] to-[#8B4513] bg-clip-text text-transparent">
            My Account
          </h1>
          <p className="text-lg text-[#62220C]/70 mt-1">
            Manage your profile, orders, and more.
          </p>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProfileSidebar />
          </aside>
          <section className="lg:col-span-3">
            <ProfileForm />
          </section>
        </main>
      </div>
    </div>
  )
}
