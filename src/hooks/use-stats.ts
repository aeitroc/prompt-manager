import { useState, useEffect } from 'react'

/**
 * Statistics data structure for header display
 */
export interface Stats {
  totalPrompts: number
  enhancedPrompts: number
  totalCategories: number
  totalTags: number
}

/**
 * Fetches application statistics from API endpoints
 * @returns Promise with stats data
 */
async function fetchStats(): Promise<Stats> {
  try {
    const [promptsResponse, categoriesResponse, tagsResponse] = await Promise.all([
      fetch('/api/prompts'),
      fetch('/api/categories'),
      fetch('/api/tags')
    ])

    const prompts = promptsResponse.ok ? await promptsResponse.json() : []
    const categories = categoriesResponse.ok ? await categoriesResponse.json() : []
    const tags = tagsResponse.ok ? await tagsResponse.json() : []

    return {
      totalPrompts: Array.isArray(prompts) ? prompts.length : 0,
      enhancedPrompts: Array.isArray(prompts) 
        ? prompts.filter((p: any) => p.isEnhanced).length 
        : 0,
      totalCategories: Array.isArray(categories) ? categories.length : 0,
      totalTags: Array.isArray(tags) ? tags.length : 0
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return {
      totalPrompts: 0,
      enhancedPrompts: 0,
      totalCategories: 0,
      totalTags: 0
    }
  }
}

/**
 * Hook to fetch and manage application statistics
 * @param refreshInterval - Optional refresh interval in milliseconds (default: 30000)
 * @returns Stats data, loading state, and refresh function
 */
export function useStats(refreshInterval: number = 30000) {
  const [stats, setStats] = useState<Stats>({
    totalPrompts: 0,
    enhancedPrompts: 0,
    totalCategories: 0,
    totalTags: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = async () => {
    try {
      setIsLoading(true)
      const data = await fetchStats()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    
    if (refreshInterval > 0) {
      const interval = setInterval(refresh, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval])

  return {
    stats,
    isLoading,
    error,
    refresh
  }
}
