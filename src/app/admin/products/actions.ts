'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { productSchema } from '@/lib/validations/product'

export type FormState = {
  errors: { [key: string]: string[] | undefined }
}

export async function upsertProduct(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await createServerClient()

    // Lấy tất cả dữ liệu từ form
    const rawFormData = Object.fromEntries(formData.entries())

    // Log để debug
    console.log('Raw form data:', rawFormData)

    const validation = productSchema.safeParse(rawFormData)

    if (!validation.success) {
      console.log('Validation errors:', validation.error.flatten().fieldErrors)
      return { errors: validation.error.flatten().fieldErrors }
    }

    const { id, ordered_images, ...productData } = validation.data

    // Xử lý upload ảnh mới
    const newImages = formData.getAll('new_images') as File[]
    console.log('New images count:', newImages.length)

    const newImageUrls: string[] = []

    for (const image of newImages) {
      if (image && image.size > 0) {
        console.log('Uploading image:', image.name, 'Size:', image.size)

        // Tạo tên file unique
        const fileExtension = image.name.split('.').pop()
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`

        try {
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from('product-images')
              .upload(fileName, image, {
                cacheControl: '3600',
                upsert: false,
              })

          if (uploadError) {
            console.error('Upload error:', uploadError)
            return {
              errors: {
                _form: [
                  `Failed to upload image ${image.name}: ${uploadError.message}`,
                ],
              },
            }
          }

          // Lấy public URL
          const {
            data: { publicUrl },
          } = supabase.storage
            .from('product-images')
            .getPublicUrl(uploadData.path)

          console.log('Uploaded successfully:', publicUrl)
          newImageUrls.push(publicUrl)
        } catch (error) {
          console.error('Error uploading image:', error)
          return { errors: { _form: [`Failed to upload image ${image.name}`] } }
        }
      }
    }

    // Kết hợp ảnh cũ và ảnh mới
    const existingImages = ordered_images ? JSON.parse(ordered_images) : []
    const finalImageUrls = [...existingImages, ...newImageUrls]

    console.log('Final image URLs:', finalImageUrls)

    // Tạo slug từ tên sản phẩm
    const slug = productData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()

    const dataToUpsert = {
      ...productData,
      slug,
      images: finalImageUrls,
      updated_at: new Date().toISOString(),
    }

    console.log('Data to upsert:', dataToUpsert)

    // Thực hiện upsert
    const query = supabase.from('products')
    const { data, error } = id
      ? await query.update(dataToUpsert).eq('id', id).select()
      : await query.insert(dataToUpsert).select()

    if (error) {
      console.error('Database error:', error)
      return { errors: { _form: [`Database error: ${error.message}`] } }
    }

    console.log('Product upserted successfully:', data)

    revalidatePath('/admin/products')
    redirect('/admin/products')
  } catch (error: unknown) {
    // Nếu là redirect error, re-throw nó
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    console.error('Unexpected error:', error)
    return {
      errors: { _form: ['An unexpected error occurred. Please try again.'] },
    }
  }
}
