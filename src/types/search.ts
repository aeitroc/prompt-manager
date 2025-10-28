// Search types and interfaces for the enhanced search system

export interface SearchFilters {
  query: string
  category?: string
  tags: string[]
  dateRange?: {
    from: Date
    to: Date
  }
  enhancedOnly?: boolean
  sortBy?: 'relevance' | 'date' | 'name' | 'usage'
  sortOrder?: 'asc' | 'desc'
}

export interface SearchSuggestion {
  id: string
  type: 'query' | 'category' | 'tag' | 'prompt'
  label: string
  value: string
  icon?: string
  count?: number
  category?: string
  tags?: string[]
}

export interface SearchState {
  filters: SearchFilters
  suggestions: SearchSuggestion[]
  isOpen: boolean
  isLoading: boolean
  selectedSuggestionIndex: number
  recentSearches: string[]
}

export interface SearchHistoryItem {
  query: string
  timestamp: Date
  resultCount: number
}

export interface QuickFilter {
  id: string
  label: string
  icon?: string
  active: boolean
  count?: number
}

// Default search filters
export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  query: '',
  tags: [],
  sortBy: 'relevance',
  sortOrder: 'desc'
}

// Search suggestion types
export const SUGGESTION_TYPES = {
  QUERY: 'query',
  CATEGORY: 'category', 
  TAG: 'tag',
  PROMPT: 'prompt'
} as const

// Sort options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date', label: 'Date Created' },
  { value: 'name', label: 'Name' },
  { value: 'usage', label: 'Most Used' }
] as const