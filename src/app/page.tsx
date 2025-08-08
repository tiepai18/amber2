import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] bg-[#FEF6E4]">
      <Image
        src="/images/hero-banner.jpg"
        alt="A cozy scene with crochet items"
        fill
        priority
        className="object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FEF6E4]/50 to-transparent"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-[#62220C] p-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-md">
          Handmade Happiness, Stitched with Love
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow">
          Discover unique crochet creations and easy-to-follow patterns to start
          your next project.
        </p>
        <Button
          asChild
          className="mt-8 h-12 px-8 text-lg bg-[#62220C] text-white hover:bg-[#8B4513] rounded-full shadow-lg"
        >
          <Link href="/shop">Shop New Arrivals</Link>
        </Button>
      </div>
    </section>
  )
}

function FeaturedProducts() {
  // TODO: Fetch your featured products from Supabase here
  const products = [
    {
      id: 1,
      name: 'Cozy Bear Amigurumi',
      price: '$25.00',
      image: 'https://placehold.co/400x400/FBDBB7/62220C?text=Bear',
    },
    {
      id: 2,
      name: 'Sunflower Coaster Pattern',
      price: '$5.00',
      image: 'https://placehold.co/400x400/FBDBB7/62220C?text=Pattern',
    },
    {
      id: 3,
      name: 'Chunky Knit Blanket',
      price: '$120.00',
      image: 'https://placehold.co/400x400/FBDBB7/62220C?text=Blanket',
    },
    {
      id: 4,
      name: 'Beginner Crochet Kit',
      price: '$40.00',
      image: 'https://placehold.co/400x400/FBDBB7/62220C?text=Kit',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-[#62220C] mb-12">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="overflow-hidden rounded-2xl mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-[#62220C]">{product.name}</h3>
              <p className="text-[#62220C]/80">{product.price}</p>
            </div>
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
        <h2 className="text-3xl font-bold text-center text-[#62220C] mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              href={category.href}
              key={category.name}
              className="relative block group overflow-hidden rounded-2xl shadow-lg"
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
                <h3 className="text-white text-3xl font-bold drop-shadow-lg">
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
