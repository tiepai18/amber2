import { LoginForm } from '@/components/auth/LoginForm'
import LoginImage from '@/components/auth/LoginImage'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | The Crochet Corner',
  description: 'Access your account at The Crochet Corner.',
}

export default function LoginPage() {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: '#FEF6E4' /* A warm, pastel background */ }}
    >
      {/* Decorative background blobs */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-[#FBDBB7]/50 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#C5B5B0]/40 rounded-full blur-xl animate-pulse delay-500"></div>

      {/* Main Container */}
      <div className="container grid lg:grid-cols-2 lg:max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white w-full">
        <LoginImage />

        {/* Right side with the login form */}
        <div className="flex items-center justify-center p-6 md:p-8 lg:p-12 overflow-y-auto">
          <div className="mx-auto flex w-full flex-col justify-center sm:w-[400px]">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
