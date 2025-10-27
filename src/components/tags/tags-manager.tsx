'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TagDialog } from './tag-dialog'
import { useTags } from '@/hooks/use-tags'
import { Plus, Edit, Trash2 } from 'lucide-react'
import type { Tag } from '@/types/prompt'

export function TagsManager() {
  const { tags, isLoading, refetch } = useTags()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingTag(null)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tag?')) return
    
    try {
      const response = await fetch(`/api/tags/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Failed to delete tag')
      }
      refetch()
    } catch (error) {
      console.error('Error deleting tag:', error)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingTag(null)
  }

  const handleSuccess = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-vscode-blue"></div>
          <p className="text-sm text-txt-secondary mt-2">Loading tags...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Manage Tags</h2>
        <Button onClick={handleCreate} className="vscode-button-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-1">
            <Badge variant="outline">{tag.name}</Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(tag)}
                className="h-6 w-6 p-0 hover:bg-bg-elevated"
                title="Edit tag"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(tag.id)}
                className="h-6 w-6 p-0 hover:bg-bg-elevated"
                title="Delete tag"
              >
                <Trash2 className="h-3 w-3 text-vscode-red" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-8 text-txt-muted">
          No tags yet. Create your first tag to start organizing prompts.
        </div>
      )}

      <TagDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        tag={editingTag}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
