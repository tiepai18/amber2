import { RegisterForm } from '@/components/auth/RegisterForm'
import RegisterImage from '@/components/auth/RegisterImage'
import { type Metadata } from 'next'

// Assuming your components are in these paths
// import { RegisterForm } from '@/components/auth/RegisterForm';
// import { RegisterImage } from '@/components/auth/RegisterImage';

export const metadata: Metadata = {
  title: 'Create Account | Ambertinybear',
  description: 'Join our community of crafters at Ambertinybear.',
}

export default function RegisterPage() {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: '#FEF6E4' }}
    >
      {/* Decorative background blobs */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-[#FBDBB7]/50 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#C5B5B0]/40 rounded-full blur-xl animate-pulse delay-500"></div>

      {/* Main Container */}
      <div className="container grid lg:grid-cols-2 lg:max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white w-full">
        {/* Left side with the registration form */}
        <div className="flex items-center justify-center p-6 md:p-8 lg:p-12 overflow-y-auto">
          <div className="mx-auto flex w-full flex-col justify-center sm:w-[400px]">
            <RegisterForm />
          </div>
        </div>

        {/* Right side with the new image */}
        <RegisterImage />
      </div>
    </div>
  )
}
