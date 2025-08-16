import { createServerClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add New Product | Ambertinybear Admin',
}

export default async function NewProductPage() {
  const supabase = await createServerClient()
  const { data: categories } = await supabase.from('categories').select('*')

  return (
    <div className="w-full bg-white/80 p-8 rounded-3xl">
      <h1 className="text-3xl font-bold text-[#62220C] mb-8">
        Add New Product
      </h1>
      <ProductForm categories={categories || []} />
    </div>
  )
}
