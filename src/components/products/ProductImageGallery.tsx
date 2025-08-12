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
  // Thay đổi state để theo dõi chỉ số (index) của ảnh được chọn
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Khi prop `images` thay đổi, reset lại ảnh được chọn về ảnh đầu tiên
  useEffect(() => {
    setSelectedIndex(0)
  }, [images])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      {/* Thumbnails */}
      <div className="lg:col-span-1 order-2 lg:order-1 flex flex-row lg:flex-col gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            // Cập nhật onClick để set chỉ số (index)
            onClick={() => setSelectedIndex(index)}
            className={cn(
              'aspect-square relative w-full overflow-hidden rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105',
              // So sánh bằng chỉ số
              selectedIndex === index
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

      {/* Main Image Display with Horizontal Carousel Effect */}
      <div className="lg:col-span-4 order-1 lg:order-2 aspect-square relative w-full overflow-hidden rounded-2xl border-2 border-[#FBDBB7]/50">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Main image for ${productName} - view ${index + 1}`}
            fill
            sizes="(max-width: 1023px) 100vw, 80vw"
            className={cn(
              'object-cover absolute inset-0 transition-transform duration-500 ease-in-out',
              // Logic trượt ngang:
              // - Ảnh được chọn: ở vị trí trung tâm (translate-x-0)
              // - Ảnh đã qua: trượt sang trái (-translate-x-full)
              // - Ảnh sắp tới: chờ ở bên phải (translate-x-full)
              index === selectedIndex
                ? 'translate-x-0'
                : index < selectedIndex
                  ? '-translate-x-full'
                  : 'translate-x-full'
            )}
          />
        ))}
      </div>
    </div>
  )
}
