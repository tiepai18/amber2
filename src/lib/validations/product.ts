import { z } from 'zod'

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Product name is required.'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category_id: z.string().uuid('Please select a category.'),
  status: z.enum(['active', 'draft']),
  ordered_images: z.string().optional(),
})
