import Image from 'next/image'
import Link from 'next/link'
import { type Tables } from '@/types/supabase'

type Product = Tables<'products'>

interface ProductCardProps {
  product: Product
  // Thêm animation delay để tạo hiệu ứng so le
  animationDelay?: string
}

export function ProductCard({ product, animationDelay }: ProductCardProps) {
  const primaryImage =
    product.images?.[0] ||
    `https://placehold.co/600x600/FBDBB7/62220C?text=${product.name.replace(/\s/g, '+')}`

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block opacity-0 animate-fade-in-up"
      style={{ animationDelay }} // Áp dụng animation delay
    >
      <div className="overflow-hidden rounded-2xl mb-4 aspect-square relative transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.is_digital && (
          <div className="absolute top-3 right-3 bg-[#62220C] text-white text-xs font-semibold px-2 py-1 rounded-full transition-transform duration-300 group-hover:scale-110">
            Digital
          </div>
        )}
      </div>
      <h3 className="font-semibold text-base text-[#62220C] truncate transition-colors duration-300 group-hover:text-[#8B4513]">
        {product.name}
      </h3>
      <p className="text-sm text-[#62220C]/80">${product.price.toFixed(2)}</p>
    </Link>
  )
}
