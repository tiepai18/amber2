import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Tables } from '@/types/supabase'

export type Product = Tables<'products'>

export type CartItem = {
  product: Product
  quantity: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
}

export const useCartStore = create<CartState>()(
  // `persist` giúp lưu giỏ hàng vào localStorage, để khách hàng không bị mất giỏ hàng khi F5.
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          )
          if (existingItem) {
            // Nếu sản phẩm đã có, tăng số lượng lên 1
            const updatedItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
            return { items: updatedItems, isOpen: true } // Mở giỏ hàng khi thêm sản phẩm
          } else {
            // Nếu chưa có, thêm sản phẩm mới vào giỏ
            const newItems = [...state.items, { product, quantity: 1 }]
            return { items: newItems, isOpen: true } // Mở giỏ hàng khi thêm sản phẩm
          }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'cart-storage', // Tên key trong localStorage
    }
  )
)
