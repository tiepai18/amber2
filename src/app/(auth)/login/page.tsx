import { LoginForm } from '@/components/auth/LoginForm'
import { type Metadata } from 'next'

// This is a Server Component, so we import the LoginForm here.
// import { LoginForm } from '@/components/auth/LoginForm'; // Assuming this is the correct path

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
        {/* Left side with image and quote */}
        <div className="relative hidden h-full lg:flex">
          <img
            src="https://images.unsplash.com/photo-1621409529035-385a1515a25f?q=80&w=1887&auto=format&fit=crop"
            alt="Handmade crochet items"
            className="object-cover w-full h-full"
            // onError={(e) => e.currentTarget.src = 'https://placehold.co/600x800/C5B5B0/62220C?text=Crochet+Love'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#62220C]/30 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 z-20">
            <blockquote className="space-y-2 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <p className="text-lg font-medium text-[#62220C]">
                &quot;Each stitch tells a story, each piece a work of
                heart.&quot;
              </p>
              <footer className="text-sm text-[#62220C]/70">
                - The Crochet Corner
              </footer>
            </blockquote>
          </div>
        </div>

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
