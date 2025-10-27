'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CategoryDialog } from './category-dialog'
import { useCategories } from '@/hooks/use-categories'
import { Plus, Edit, Trash2 } from 'lucide-react'
import type { Category } from '@/types/prompt'

export function CategoriesManager() {
  const { categories, isLoading, refetch } = useCategories()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Prompts will be uncategorized.')) return
    
    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Failed to delete category')
      }
      refetch()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingCategory(null)
  }

  const handleSuccess = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-vscode-blue"></div>
          <p className="text-sm text-txt-secondary mt-2">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Manage Categories</h2>
        <Button onClick={handleCreate} className="vscode-button-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category) => (
          <Card key={category.id} className="vscode-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
                {category.isDefault && (
                  <span className="text-xs text-txt-muted">(default)</span>
                )}
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="h-8 w-8 p-0 hover:bg-bg-elevated"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {!category.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="h-8 w-8 p-0 hover:bg-bg-elevated"
                  >
                    <Trash2 className="h-4 w-4 text-vscode-red" />
                  </Button>
                )}
              </div>
            </div>
            
            {category._count && (
              <div className="mt-2 text-xs text-txt-muted">
                {category._count.prompts} prompt{category._count.prompts !== 1 ? 's' : ''}
              </div>
            )}
          </Card>
        ))}
      </div>

      <CategoryDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        category={editingCategory}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
