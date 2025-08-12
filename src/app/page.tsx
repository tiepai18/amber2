import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createServerClient } from '@/lib/supabase/server' // Import Supabase client
import { type Tables } from '@/types/supabase'

type Product = Tables<'products'>

function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] bg-[#FEF6E4] overflow-hidden">
      <Image
        src="/images/hero-banner.jpg"
        alt="A cozy scene with crochet items"
        fill
        priority
        className="object-cover opacity-90 animate-fade-in"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FEF6E4]/50 to-transparent"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-[#62220C] p-4">
        <h1
          className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-md opacity-0 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          Handmade Happiness, Stitched with Love
        </h1>
        <p
          className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow opacity-0 animate-fade-in-up"
          style={{ animationDelay: '400ms' }}
        >
          Discover unique crochet creations and easy-to-follow patterns to start
          your next project.
        </p>
        <Button
          asChild
          className="mt-8 h-12 px-8 text-lg bg-[#62220C] text-white hover:bg-[#8B4513] rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '600ms' }}
        >
          <Link href="/shop">Shop New Arrivals</Link>
        </Button>
      </div>
    </section>
  )
}

function FeaturedProductCard({
  product,
  animationDelay,
}: {
  product: Product
  animationDelay: string
}) {
  const primaryImage =
    product.images?.[0] ||
    `https://placehold.co/400x400/FBDBB7/62220C?text=Image`
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block opacity-0 animate-fade-in-up"
      style={{ animationDelay }}
    >
      <div className="overflow-hidden rounded-2xl mb-4 aspect-square relative transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="font-semibold text-[#62220C] transition-colors duration-300 group-hover:text-[#8B4513]">
        {product.name}
      </h3>
      <p className="text-[#62220C]/80">${product.price.toFixed(2)}</p>
    </Link>
  )
}

async function FeaturedProducts() {
  const supabase = await createServerClient()
  // Lấy 4 sản phẩm mới nhất để làm nổi bật
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-[#62220C] mb-12 opacity-0 animate-fade-in-up">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {products?.map((product, index) => (
            <FeaturedProductCard
              key={product.id}
              product={product}
              animationDelay={`${index * 100}ms`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ShopByCategory() {
  const categories = [
    {
      name: 'Amigurumi',
      href: '/shop/amigurumi',
      image: '/images/category-amigurumi.jpg',
    },
    {
      name: 'Patterns',
      href: '/shop/patterns',
      image: '/images/category-patterns.jpg',
    },
    {
      name: 'Yarn & Tools',
      href: '/shop/yarn',
      image: '/images/category-yarn.jpg',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-[#FEF6E4]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-[#62220C] mb-12 opacity-0 animate-fade-in-up">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              href={category.href}
              key={category.name}
              className="relative block group overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Image
                src={category.image}
                alt={category.name}
                width={600}
                height={800}
                className="group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <ShopByCategory />
    </main>
  )
}
