'use client'

import Image from 'next/image'

function LoginImage() {
  return (
    <div className="relative hidden h-full lg:flex">
      <Image
        // The path is relative to the `public` directory.
        src="/images/login-bg.jpg"
        alt="A person crocheting"
        // The `fill` prop makes the image cover the parent container.
        fill
        // The `sizes` prop helps Next.js optimize for different screen sizes.
        sizes="(max-width: 1023px) 100vw, 50vw"
        // The `priority` prop tells Next.js to load this image first.
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#62220C]/30 to-transparent"></div>
      <div className="absolute bottom-8 left-8 right-8 z-20">
        <blockquote className="space-y-2 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <p className="text-lg font-medium text-[#62220C]">
            &quot;Each stitch tells a story, each piece a work of heart.&quot;
          </p>
          <footer className="text-sm text-[#62220C]/70">
            - The Crochet Corner
          </footer>
        </blockquote>
      </div>
    </div>
  )
}

export default LoginImage
