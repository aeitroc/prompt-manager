'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Tag } from '@/types/prompt'

interface TagDialogProps {
  isOpen: boolean
  onClose: () => void
  tag?: Tag | null
  onSuccess: () => void
}

export function TagDialog({ isOpen, onClose, tag, onSuccess }: TagDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState(tag?.name || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      return
    }

    try {
      setIsSubmitting(true)
      const url = tag ? `/api/tags/${tag.id}` : '/api/tags'
      const method = tag ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to save tag')
      }

      onSuccess()
      onClose()
      setName('')
    } catch (error) {
      console.error('Error saving tag:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tag ? 'Edit Tag' : 'Create New Tag'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Tag Name *</Label>
            <Input
              id="tag-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tag name..."
              className="vscode-input"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? 'Saving...' : tag ? 'Update Tag' : 'Create Tag'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
