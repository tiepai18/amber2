'use client'

import { useCartStore } from '@/lib/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } =
    useCartStore()

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  return (
    <>
      {/* Lớp phủ nền */}
      <div
        onClick={toggleCart}
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ease-in-out',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      />
      {/* Nội dung Sidebar */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#FBDBB7]/50">
          <h2 className="text-2xl font-bold text-[#62220C]">Shopping Cart</h2>
          <Button variant="ghost" size="icon" onClick={toggleCart}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {items.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.product.id} className="flex items-start gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-[#FBDBB7]/50">
                      <Image
                        src={
                          item.product.images?.[0] ||
                          'https://placehold.co/100x100'
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#62220C] leading-tight">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-[#62220C]/80">
                        ${item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.product.id,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-16 rounded-md border border-[#C5B5B0] text-center h-8"
                          aria-label={`Quantity for ${item.product.name}`}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-[#FBDBB7]/50 p-6">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold text-lg text-[#62220C]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full h-12 bg-[#62220C] text-white hover:bg-[#8B4513] rounded-xl"
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <p className="text-lg font-semibold text-[#62220C]">
              Your cart is empty
            </p>
            <p className="text-sm text-[#62220C]/70 mt-2">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Button
              asChild
              onClick={toggleCart}
              className="mt-6 bg-[#62220C] text-white hover:bg-[#8B4513] rounded-xl"
            >
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
