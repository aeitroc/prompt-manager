'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PromptEnhanceDialog } from './prompt-enhance-dialog'
import { useCategories } from '@/hooks/use-categories'
import { useTags } from '@/hooks/use-tags'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPromptSchema, type CreatePromptInput } from '@/lib/validations/prompt'
import { PROMPT_COLORS } from '@/lib/colors'
import { X, Sparkles } from 'lucide-react'
import type { Prompt, Category, Tag } from '@/types/prompt'

interface PromptFormProps {
  prompt?: (Prompt & { category: Category | null; tags: Tag[] }) | null
  onSubmit: (data: CreatePromptInput) => Promise<void>
  onCancel: () => void
}

export function PromptForm({ prompt, onSubmit, onCancel }: PromptFormProps) {
  const { categories } = useCategories()
  const { tags: allTags } = useTags()
  const [selectedTags, setSelectedTags] = useState<string[]>(prompt?.tags?.map((t) => t.name) || [])
  const [newTagInput, setNewTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEnhanceDialog, setShowEnhanceDialog] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePromptInput>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: prompt?.title || '',
      content: prompt?.content || '',
      description: prompt?.description || '',
      color: prompt?.color || '#007ACC',
      categoryId: prompt?.categoryId || '',
      tags: selectedTags,
    },
  })

  const currentContent = watch('content')
  const currentTitle = watch('title')

  const handleFormSubmit = async (data: CreatePromptInput) => {
    try {
      setIsSubmitting(true)
      await onSubmit({ ...data, tags: selectedTags })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEnhancePrompt = (enhancedContent: string, metadata: any) => {
    setValue('content', enhancedContent)
    // Update selectedTags if memory patterns were used
    if (metadata.memoryPatternsUsed?.length > 0) {
      setSelectedTags([])
    }
    setShowEnhanceDialog(false)
  }

  const handleAddTag = () => {
    if (newTagInput.trim() && !selectedTags.includes(newTagInput.trim())) {
      setSelectedTags([...selectedTags, newTagInput.trim()])
      setNewTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Enter prompt title..."
            className="vscode-input"
          />
          {errors.title && (
            <p className="text-sm text-vscode-red">{errors.title.message}</p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="content">Content *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowEnhanceDialog(true)}
              disabled={!currentContent || currentContent.length < 10}
              className="text-vscode-blue disabled:opacity-50 disabled:cursor-not-allowed"
              title={!currentContent || currentContent.length < 10 ? "Add at least 10 characters to enable AI enhancement" : "Enhance this prompt with AI"}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Enhance with AI
            </Button>
          </div>
          <Textarea
            id="content"
            {...register('content')}
            placeholder="Enter your prompt..."
            className="vscode-input min-h-[200px] font-mono text-sm"
          />
          {errors.content && (
            <p className="text-sm text-vscode-red">{errors.content.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Brief description of this prompt..."
            className="vscode-input min-h-[80px]"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={watch('categoryId') || 'none'}
            onValueChange={(value) => setValue('categoryId', value === 'none' ? null : value)}
          >
            <SelectTrigger className="vscode-input">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-bg-secondary border-bdr-default">
              <SelectItem value="none">No category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="grid grid-cols-10 gap-2">
            {PROMPT_COLORS.slice(0, 20).map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setValue('color', color.value)}
                className={`w-8 h-8 rounded-sm border-2 transition-all ${
                  watch('color') === color.value
                    ? 'border-white scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tag-input">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tag-input"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags..."
              className="vscode-input flex-1"
              list="tags-datalist"
            />
            <datalist id="tags-datalist">
              {allTags.map((tag) => (
                <option key={tag.id} value={tag.name} />
              ))}
            </datalist>
            <Button type="button" onClick={handleAddTag} variant="secondary">
              Add
            </Button>
          </div>
          
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="pr-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:bg-bg-elevated rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : prompt ? 'Update Prompt' : 'Create Prompt'}
          </Button>
        </div>
      </form>
      
      <PromptEnhanceDialog
        isOpen={showEnhanceDialog}
        onClose={() => setShowEnhanceDialog(false)}
        promptTitle={currentTitle || 'Untitled'}
        originalContent={currentContent}
        category={categories.find(c => c.id === watch('categoryId'))?.name}
        tags={selectedTags}
        onAcceptEnhancement={handleEnhancePrompt}
      />
    </>
  )
}
