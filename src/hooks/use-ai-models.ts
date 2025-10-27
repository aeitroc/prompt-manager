'use client'

import { useState, useEffect } from 'react'
import type { AIModelConfig } from '@/types/ai'

export function useAIModels() {
  const [models, setModels] = useState<AIModelConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/ai/models')
        if (!response.ok) {
          throw new Error('Failed to fetch AI models')
        }

        const data = await response.json()
        setModels(data.models || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Error fetching AI models:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [])

  return { models, isLoading, error }
}
