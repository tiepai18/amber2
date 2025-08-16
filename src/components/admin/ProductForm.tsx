'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { upsertProduct, type FormState } from '@/app/admin/products/actions'
import { type Tables } from '@/types/supabase'
import Image from 'next/image'
import { XCircle, GripVertical, UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

type Product = Tables<'products'>
type Category = Tables<'categories'>

type ImageItem = {
  id: string
  url: string
  file?: File
  isNew: boolean
}

interface ProductFormProps {
  categories: Category[]
  initialData?: Product | null
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-[#62220C] text-white hover:bg-[#8B4513]"
    >
      {pending ? 'Saving...' : isEditing ? 'Update Product' : 'Save Product'}
    </Button>
  )
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const [images, setImages] = useState<ImageItem[]>([])
  const [draggedItem, setDraggedItem] = useState<ImageItem | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (initialData?.images) {
      setImages(
        initialData.images.map((url) => ({ id: url, url, isNew: false }))
      )
    }
  }, [initialData])

  const initialState: FormState = { errors: {} }
  const [state, dispatch] = useFormState(upsertProduct, initialState)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImageItems: ImageItem[] = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
      isNew: true,
    }))
    setImages((prev) => [...prev, ...newImageItems])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
  })

  const removeImage = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id)
    if (imageToRemove?.isNew) {
      URL.revokeObjectURL(imageToRemove.url)
    }
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleDragStart = (item: ImageItem) => setDraggedItem(item)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault()
  const handleDrop = (targetItem: ImageItem) => {
    if (!draggedItem || draggedItem.id === targetItem.id) return
    const newImages = [...images]
    const draggedIndex = images.findIndex((item) => item.id === draggedItem.id)
    const targetIndex = images.findIndex((item) => item.id === targetItem.id)
    newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedItem)
    setImages(newImages)
    setDraggedItem(null)
  }

  // FIX: Sử dụng action trực tiếp với formData được xây dựng đúng cách
  const handleSubmit = async (formData: FormData) => {
    // Xóa tất cả new_images cũ (nếu có)
    formData.delete('new_images')

    // Thêm các file ảnh mới vào FormData với đúng thứ tự
    images.forEach((image) => {
      if (image.isNew && image.file) {
        formData.append('new_images', image.file)
      }
    })

    // Gọi server action
    dispatch(formData)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-8">
      {initialData?.id && (
        <input type="hidden" name="id" value={initialData.id} />
      )}
      <input
        type="hidden"
        name="ordered_images"
        value={JSON.stringify(
          images.filter((img) => !img.isNew).map((img) => img.url)
        )}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" defaultValue={initialData?.name} />
            {state.errors?.name && (
              <p className="text-sm text-red-600">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={8}
              defaultValue={initialData?.description || ''}
            />
            {state.errors?.description && (
              <p className="text-sm text-red-600">
                {state.errors.description[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group aspect-square cursor-grab"
                    draggable
                    onDragStart={() => handleDragStart(image)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(image)}
                  >
                    <Image
                      src={image.url}
                      alt="Product image"
                      fill
                      className="rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1 right-1 bg-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <XCircle className="h-5 w-5 text-red-500" />
                    </button>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <GripVertical className="h-6 w-6 text-white" />
                    </div>
                    {image.isNew && (
                      <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                        New
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div
              {...getRootProps()}
              className={cn(
                'cursor-pointer border-2 border-dashed border-[#C5B5B0] rounded-xl p-8 text-center text-[#62220C]/70 transition-colors',
                isDragActive && 'border-[#62220C] bg-[#FBDBB7]/20'
              )}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-12 w-12" />
              <p className="mt-2">
                Drag & drop images here, or click to select files
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={initialData?.price}
            />
            {state.errors?.price && (
              <p className="text-sm text-red-600">{state.errors.price[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <Select
              name="category_id"
              defaultValue={initialData?.category_id || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.category_id && (
              <p className="text-sm text-red-600">
                {state.errors.category_id[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={initialData?.status || 'draft'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.status && (
              <p className="text-sm text-red-600">{state.errors.status[0]}</p>
            )}
          </div>
        </div>
      </div>

      {state.errors?._form && (
        <p className="text-sm text-red-600">{state.errors._form[0]}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton isEditing={!!initialData} />
      </div>
    </form>
  )
}
