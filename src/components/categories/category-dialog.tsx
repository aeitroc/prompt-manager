'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCategorySchema, type CreateCategoryInput } from '@/lib/validations/category'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PROMPT_COLORS } from '@/lib/colors'
import type { Category } from '@/types/prompt'

interface CategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  category?: Category | null
  onSuccess: () => void
}

export function CategoryDialog({ isOpen, onClose, category, onSuccess }: CategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name || '',
      color: category?.color || '#007ACC',
      icon: category?.icon || '',
    },
  })

  const selectedColor = watch('color')

  const handleFormSubmit = async (data: CreateCategoryInput) => {
    try {
      setIsSubmitting(true)
      const url = category ? `/api/categories/${category.id}` : '/api/categories'
      const method = category ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save category')
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving category:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Create New Category'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter category name..."
              className="vscode-input"
            />
            {errors.name && (
              <p className="text-sm text-vscode-red">{errors.name.message}</p>
            )}
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-8 gap-2">
              {PROMPT_COLORS.slice(0, 16).map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setValue('color', color.value)}
                  className={`w-8 h-8 rounded-sm border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-white scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label htmlFor="icon">Icon (optional)</Label>
            <Input
              id="icon"
              {...register('icon')}
              placeholder="Lucide icon name..."
              className="vscode-input"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
