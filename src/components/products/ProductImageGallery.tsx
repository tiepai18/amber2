'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0])

  useEffect(() => {
    setSelectedImage(images[0])
  }, [images])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      {/* Thumbnails */}
      <div className="lg:col-span-1 order-2 lg:order-1 flex flex-row lg:flex-col gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={cn(
              'aspect-square relative w-full overflow-hidden rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105',
              selectedImage === image
                ? 'border-[#62220C]'
                : 'border-transparent hover:border-[#C5B5B0]'
            )}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1} for ${productName}`}
              fill
              sizes="(max-width: 1023px) 20vw, 10vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Display with Cross-fade Effect */}
      <div className="lg:col-span-4 order-1 lg:order-2 aspect-square relative w-full overflow-hidden rounded-2xl border-2 border-[#FBDBB7]/50">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Main image for ${productName} - view ${index + 1}`}
            fill
            sizes="(max-width: 1023px) 100vw, 80vw"
            className={cn(
              'object-cover transition-opacity duration-500 ease-in-out',
              selectedImage === image ? 'opacity-100' : 'opacity-0'
            )}
          />
        ))}
      </div>
    </div>
  )
}
