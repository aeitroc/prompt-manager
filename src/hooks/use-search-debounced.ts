import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for debounced search functionality
 * @param initialQuery - Initial search query
 * @param delay - Debounce delay in milliseconds (default: 300)
 * @param onDebouncedSearch - Callback function triggered after debounce
 */
export function useSearchDebounced<T = string>(
  initialQuery: T,
  delay: number = 300,
  onDebouncedSearch?: (query: T) => void
) {
  const [query, setQuery] = useState<T>(initialQuery)
  const [isDebouncing, setIsDebouncing] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastQueryRef = useRef<T>(initialQuery)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const updateQuery = useCallback((newQuery: T) => {
    // Update local state immediately
    setQuery(newQuery)
    setIsDebouncing(true)

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      // Only trigger callback if query actually changed
      if (JSON.stringify(newQuery) !== JSON.stringify(lastQueryRef.current)) {
        lastQueryRef.current = newQuery
        onDebouncedSearch?.(newQuery)
      }
      setIsDebouncing(false)
    }, delay)
  }, [delay, onDebouncedSearch])

  // Force immediate search (for form submission, etc.)
  const triggerSearch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsDebouncing(false)
    onDebouncedSearch?.(query)
  }, [query, onDebouncedSearch])

  // Cancel current debounce
  const cancelDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      setIsDebouncing(false)
    }
  }, [])

  return {
    query,
    setQuery: updateQuery,
    isDebouncing,
    triggerSearch,
    cancelDebounce
  }
}

/**
 * Hook for managing recent searches with localStorage persistence
 * @param maxItems - Maximum number of recent searches to store
 */
export function useRecentSearches(maxItems: number = 10) {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('prompt-manager-recent-searches')
      if (stored) {
        const parsed = JSON.parse(stored)
        setRecentSearches(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error)
    }
  }, [])

  // Save to localStorage when recentSearches changes
  useEffect(() => {
    try {
      localStorage.setItem('prompt-manager-recent-searches', JSON.stringify(recentSearches))
    } catch (error) {
      console.warn('Failed to save recent searches:', error)
    }
  }, [recentSearches])

  // Add new search to recent searches
  const addRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return

    setRecentSearches(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item !== searchQuery)
      // Add to beginning and limit length
      return [searchQuery, ...filtered].slice(0, maxItems)
    })
  }, [maxItems])

  // Clear all recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
  }, [])

  // Remove specific search
  const removeRecentSearch = useCallback((searchQuery: string) => {
    setRecentSearches(prev => prev.filter(item => item !== searchQuery))
  }, [])

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch
  }
}

/**
 * Hook for managing search history with timestamps
 */
export function useSearchHistory(maxItems: number = 50) {
  const [searchHistory, setSearchHistory] = useState<Array<{
    query: string
    timestamp: Date
    resultCount: number
  }>>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('prompt-manager-search-history')
      if (stored) {
        const parsed = JSON.parse(stored)
        setSearchHistory(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.warn('Failed to load search history:', error)
    }
  }, [])

  // Save to localStorage when searchHistory changes
  useEffect(() => {
    try {
      localStorage.setItem('prompt-manager-search-history', JSON.stringify(searchHistory))
    } catch (error) {
      console.warn('Failed to save search history:', error)
    }
  }, [searchHistory])

  const addSearchToHistory = useCallback((query: string, resultCount: number = 0) => {
    if (!query.trim()) return

    setSearchHistory(prev => {
      // Remove existing entry with same query
      const filtered = prev.filter(item => item.query !== query)
      // Add new entry at beginning
      const newEntry = {
        query,
        timestamp: new Date(),
        resultCount
      }
      // Limit size and return
      return [newEntry, ...filtered].slice(0, maxItems)
    })
  }, [maxItems])

  const clearHistory = useCallback(() => {
    setSearchHistory([])
  }, [])

  const getPopularSearches = useCallback((limit: number = 5) => {
    const counts: Record<string, number> = {}
    
    searchHistory.forEach(entry => {
      counts[entry.query] = (counts[entry.query] || 0) + 1
    })

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }))
  }, [searchHistory])

  return {
    searchHistory,
    addSearchToHistory,
    clearHistory,
    getPopularSearches
  }
}