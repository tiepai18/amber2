import { createServerClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'
import { type Metadata } from 'next'

// Hàm này tạo metadata động cho trang
export async function generateMetadata({
  params,
}: {
  params: { productId: string }
}): Promise<Metadata> {
  const supabase = await createServerClient()
  const { data: product } = await supabase
    .from('products')
    .select('name')
    .eq('id', params.productId)
    .single()
  return {
    title: `Edit: ${product?.name || 'Product'} | Ambertinybear Admin`,
  }
}

export default async function EditProductPage({
  params,
}: {
  params: { productId: string }
}) {
  const supabase = await createServerClient()

  // Lấy dữ liệu của sản phẩm cần sửa
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.productId)
    .single()

  // Lấy danh sách tất cả các danh mục
  const { data: categories } = await supabase.from('categories').select('*')

  if (!product) {
    notFound()
  }

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-[#FBDBB7]/30 p-8">
      <h1 className="text-3xl font-bold text-[#62220C] mb-8">Edit Product</h1>
      {/* Truyền dữ liệu ban đầu (initialData) vào ProductForm */}
      <ProductForm categories={categories || []} initialData={product} />
    </div>
  )
}
