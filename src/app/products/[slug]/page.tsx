import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag, CheckCircle } from 'lucide-react'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import Link from 'next/link'
import { type Tables } from '@/types/supabase'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

type ProductWithCategory = Tables<'products'> & {
  categories: {
    name: string
    slug: string
  } | null
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: product } = await supabase
    .from('products')
    .select('name, short_description')
    .eq('slug', slug)
    .single()

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.name} | The Crochet Corner`,
    description: product.short_description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: product, error } = (await supabase
    .from('products')
    .select('*, categories ( name, slug )')
    .eq('slug', slug)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .single()) as { data: ProductWithCategory | null; error: any }

  if (error || !product) {
    notFound()
  }

  const imageList = product.images?.length
    ? product.images
    : [
        `https://placehold.co/800x800/FBDBB7/62220C?text=${product.name.replace(/\s/g, '+')}`,
      ]

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="opacity-0 animate-fade-in">
            <ProductImageGallery
              images={imageList}
              productName={product.name}
            />
          </div>

          {/* Product Details */}
          <div
            className="flex flex-col opacity-0 animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
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
              {product.quantity && product.quantity > 0 && (
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <strong>In Stock</strong> ({product.quantity} available)
                </p>
              )}
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  className="flex-1 h-12 bg-[#62220C] text-white hover:bg-[#8B4513] rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-2 border-[#FBDBB7] text-[#62220C] hover:bg-[#FBDBB7]/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mt-10 prose text-[#62220C]/90 max-w-none border-t border-[#FBDBB7]/50 pt-6">
              <h3 className="font-bold text-lg mb-2">Product Description</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
