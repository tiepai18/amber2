import { z } from 'zod'

export const shippingSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'Please enter a valid city'),
  country: z.string().min(2, 'Please enter a valid country'),
  postalCode: z.string().min(4, 'Please enter a valid postal code'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
})

export type ShippingInput = z.infer<typeof shippingSchema>
