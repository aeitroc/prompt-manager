'use client'

import { useState, useEffect } from 'react'
import type { Prompt, Category, Tag } from '@/types/prompt'

interface UsePromptsOptions {
  categoryId?: string
  tags?: string[]
}

export function usePrompts(options: UsePromptsOptions = {}) {
  const [prompts, setPrompts] = useState<(Prompt & { category: Category | null; tags: Tag[] })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrompts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      if (options.categoryId) {
        params.append('categoryId', options.categoryId)
      }
      
      if (options.tags && options.tags.length > 0) {
        params.append('tags', options.tags.join(','))
      }

      const response = await fetch(`/api/prompts?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch prompts')
      }

      const data = await response.json()
      setPrompts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching prompts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrompts()
  }, [options.categoryId, options.tags?.join(',')])

  return {
    prompts,
    isLoading,
    error,
    refetch: fetchPrompts,
  }
}
