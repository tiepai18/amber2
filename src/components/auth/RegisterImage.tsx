'use client'

function RegisterImage() {
  return (
    <div className="relative hidden h-full lg:flex">
      <img
        src="https://images.unsplash.com/photo-1595342391513-4a1706a388e3?q=80&w=1887&auto=format&fit=crop"
        alt="Colorful balls of yarn"
        className="object-cover w-full h-full"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src =
            'https://placehold.co/600x800/FBDBB7/62220C?text=Join+Us!'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#62220C]/40 to-transparent"></div>
      <div className="absolute bottom-8 left-8 right-8 z-20">
        <blockquote className="space-y-2 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <p className="text-lg font-medium text-[#62220C]">
            &quot;Creativity is contagious, pass it on. Join our family of
            makers and dreamers.&quot;
          </p>
          <footer className="text-sm text-[#62220C]/70">
            - The Crochet Corner
          </footer>
        </blockquote>
      </div>
    </div>
  )
}

export default RegisterImage
