'use client'

import { useState, useEffect } from 'react'
import type { Tag } from '@/types/prompt'

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/tags')
      if (!response.ok) {
        throw new Error('Failed to fetch tags')
      }

      const data = await response.json()
      setTags(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching tags:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return {
    tags,
    isLoading,
    error,
    refetch: fetchTags,
  }
}
