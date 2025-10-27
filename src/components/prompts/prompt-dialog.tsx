'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PromptForm } from './prompt-form'
import { Button } from '@/components/ui/button'
import type { Prompt } from '@/types/prompt'
import { createPromptSchema, type CreatePromptInput } from '@/lib/validations/prompt'
import type { Category, Tag } from '@/types/prompt'

interface PromptDialogProps {
  isOpen: boolean
  onClose: () => void
  prompt?: Prompt & { category: Category | null; tags: Tag[] } | null
  onSuccess: () => void
}

export function PromptDialog({ isOpen, onClose, prompt, onSuccess }: PromptDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: CreatePromptInput) => {
    try {
      setIsSubmitting(true)
      const url = prompt ? `/api/prompts/${prompt.id}` : '/api/prompts'
      const method = prompt ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save prompt')
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving prompt:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {prompt ? 'Edit Prompt' : 'Create New Prompt'}
          </DialogTitle>
        </DialogHeader>
        
        <PromptForm
          prompt={prompt}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
