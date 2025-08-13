import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductPageClient } from '@/components/products/ProductPageClient'
type ProductPageProps = {
  params: { slug: string }
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

  const { data: product } = await supabase
    .from('products')
    .select('*, categories ( name, slug )')
    .eq('slug', slug)
    .single()

  if (!product) {
    notFound()
  }

  return <ProductPageClient product={product} />
}
