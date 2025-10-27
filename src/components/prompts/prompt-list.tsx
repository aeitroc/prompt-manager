'use client'

import { PromptCard } from './prompt-card'
import { PromptListItem } from './prompt-list-item'
import { useViewStore } from '@/store/view-store'
import { FileText, Loader2 } from 'lucide-react'
import type { Prompt, Category, Tag } from '@/types/prompt'

interface PromptListProps {
  prompts: (Prompt & { category: Category | null; tags: Tag[] })[]
  isLoading: boolean
  onEdit: (prompt: Prompt & { category: Category | null; tags: Tag[] }) => void
  onDelete: (id: string) => void
  onEnhance?: (prompt: Prompt & { category: Category | null; tags: Tag[] }) => void
  onPromptClick?: (prompt: Prompt & { category: Category | null; tags: Tag[] }) => void
}

export function PromptList({ 
  prompts, 
  isLoading, 
  onEdit, 
  onDelete,
  onPromptClick 
}: PromptListProps) {
  const { viewMode } = useViewStore()
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-vscode-blue" />
      </div>
    )
  }
  
  // Empty state
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-txt-muted mb-4" />
        <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
        <p className="text-sm text-txt-secondary mb-4">
          Get started by creating your first prompt
        </p>
      </div>
    )
  }
  
  // Card view (grid)
  if (viewMode === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onEdit={onEdit}
            onDelete={onDelete}
            onClick={onPromptClick}
          />
        ))}
      </div>
    )
  }
  
  // List view
  return (
    <div className="space-y-2">
      {prompts.map((prompt) => (
        <PromptListItem
          key={prompt.id}
          prompt={prompt}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onPromptClick}
        />
      ))}
    </div>
  )
}
