'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCartStore } from '@/lib/store/cart'
import { shippingSchema, type ShippingInput } from '@/lib/validations/checkout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const router = useRouter()

  // Chuyển hướng về trang chủ nếu giỏ hàng trống
  useEffect(() => {
    if (items.length === 0) {
      router.push('/')
    }
  }, [items, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingInput>({
    resolver: zodResolver(shippingSchema),
  })

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )
  const shippingFee = 5.0 // Giả sử phí ship cố định
  const total = subtotal + shippingFee

  // Xử lý khi người dùng nhấn "Place Order"
  const onSubmit = (data: ShippingInput) => {
    console.log('Shipping Details:', data)
    console.log('Order Items:', items)
    console.log('Total:', total)
    // Bước tiếp theo: Tích hợp Stripe để xử lý thanh toán ở đây
    alert('Proceeding to payment... (Stripe integration is the next step)')
    // clearCart(); // Xóa giỏ hàng sau khi đặt hàng thành công
  }

  if (items.length === 0) {
    return null // Hoặc hiển thị một màn hình loading trong khi chuyển hướng
  }

  return (
    <div className="bg-[#FEF6E4] min-h-screen">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <header className="text-center mb-12 opacity-0 animate-fade-in-up">
          <h1 className="text-4xl font-bold tracking-tight text-[#62220C]">
            Checkout
          </h1>
          <p className="text-lg text-[#62220C]/70 mt-2">
            You&apos;re just a few steps away from your new creations!
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {/* Cột trái: Thông tin giao hàng */}
          <div
            className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-[#FBDBB7]/30 p-8 space-y-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <h2 className="text-2xl font-bold text-[#62220C]">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...register('fullName')} />
                {errors.fullName && (
                  <p className="text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} />
                {errors.address && (
                  <p className="text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register('country')} />
                {errors.country && (
                  <p className="text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" {...register('postalCode')} />
                {errors.postalCode && (
                  <p className="text-sm text-red-600">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" {...register('phone')} />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div
            className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-[#FBDBB7]/30 p-8 h-fit sticky top-28 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '400ms' }}
          >
            <h2 className="text-2xl font-bold text-[#62220C] mb-6">
              Order Summary
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden border">
                    <Image
                      src={item.product.images?.[0] || ''}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[#62220C]">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="ml-auto font-medium text-[#62220C]">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[#FBDBB7]/50 space-y-2 text-[#62220C]/90">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#62220C]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 mt-6 bg-[#62220C] text-white hover:bg-[#8B4513] rounded-xl transition-transform hover:scale-105"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
