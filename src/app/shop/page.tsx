import { type Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/products/ProductCard'

export const metadata: Metadata = {
  title: 'Shop All | The Crochet Corner',
  description:
    'Browse our collection of handmade crochet items, patterns, and kits.',
}

export default async function ShopPage() {
  const supabase = await createServerClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <header className="text-center mb-12 opacity-0 animate-fade-in-up">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#62220C] to-[#8B4513] bg-clip-text text-transparent">
            Our Collection
          </h1>
          <p className="text-lg text-[#62220C]/70 mt-2">
            Find your next creative project or the perfect handmade gift.
          </p>
        </header>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product, index) => (
              // Thêm animation delay cho mỗi card để tạo hiệu ứng so le
              <ProductCard
                key={product.id}
                product={product}
                animationDelay={`${index * 100}ms`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 opacity-0 animate-fade-in">
            <p className="text-lg text-[#62220C]/80">
              No products found. Please check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
