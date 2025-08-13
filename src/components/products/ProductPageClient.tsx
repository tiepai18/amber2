'use client'

import { type Tables } from '@/types/supabase'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'

type ProductWithCategory = Tables<'products'> & {
  categories: { name: string; slug: string } | null
}

interface ProductPageClientProps {
  product: ProductWithCategory
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  // Lấy hàm `addItem` từ kho chứa giỏ hàng (Zustand store)
  const addItem = useCartStore((state) => state.addItem)

  // Chuẩn bị danh sách ảnh, có dự phòng nếu không có ảnh
  const imageList = product.images?.length
    ? product.images
    : [
        `https://placehold.co/800x800/FBDBB7/62220C?text=${product.name.replace(/\s/g, '+')}`,
      ]

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Thư viện ảnh sản phẩm */}
          <ProductImageGallery images={imageList} productName={product.name} />

          {/* Chi tiết sản phẩm */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-[#62220C]">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mt-4">
              <p className="text-3xl text-[#8B4513] font-bold">
                ${product.price.toFixed(2)}
              </p>
              {product.compare_at_price && (
                <p className="text-xl text-gray-400 line-through">
                  ${product.compare_at_price.toFixed(2)}
                </p>
              )}
            </div>

            {product.short_description && (
              <p className="mt-4 text-lg text-[#62220C]/80">
                {product.short_description}
              </p>
            )}

            <div className="mt-6 text-sm text-[#62220C]/70 space-y-2 border-t border-[#FBDBB7]/50 pt-6">
              {product.categories && (
                <p>
                  <strong>Category:</strong>{' '}
                  <Link
                    href={`/shop/category/${product.categories.slug}`}
                    className="hover:underline"
                  >
                    {product.categories.name}
                  </Link>
                </p>
              )}
              {product.sku && (
                <p>
                  <strong>SKU:</strong> {product.sku}
                </p>
              )}
              {product.quantity && product.quantity > 0 ? (
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <strong>In Stock</strong> ({product.quantity} available)
                </p>
              ) : (
                <p className="flex items-center gap-2 text-red-500">
                  <strong>Out of Stock</strong>
                </p>
              )}
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-4">
                {/* Nút "Add to Cart" giờ đã được kết nối với store */}
                <Button
                  onClick={() => addItem(product)}
                  size="lg"
                  className="flex-1 h-12 bg-[#62220C] text-white hover:bg-[#8B4513] rounded-xl shadow-md"
                  disabled={!product.quantity || product.quantity <= 0}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-2 border-[#FBDBB7] text-[#62220C] hover:bg-[#FBDBB7]/50 rounded-xl"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
