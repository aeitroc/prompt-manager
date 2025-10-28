import type { SearchFilters, SearchSuggestion, Prompt, Category, Tag } from '@/types/search'
import type { Prompt as PromptType, Category as CategoryType, Tag as TagType } from '@/types/prompt'

/**
 * Generate search suggestions based on prompts, categories, and tags
 */
export function generateSearchSuggestions(
  prompts: PromptType[],
  categories: CategoryType[],
  tags: TagType[],
  query: string,
  recentSearches: string[] = []
): SearchSuggestion[] {
  if (!query.trim() && recentSearches.length === 0) {
    return []
  }

  const suggestions: SearchSuggestion[] = []
  const queryLower = query.toLowerCase()

  // Add recent searches
  if (recentSearches.length > 0 && !query) {
    recentSearches.slice(0, 5).forEach(recentQuery => {
      suggestions.push({
        id: `recent-${recentQuery}`,
        type: 'query',
        label: `Recent: ${recentQuery}`,
        value: recentQuery,
        icon: 'Clock'
      })
    })
  }

  // Add recent searches that match current query
  const matchingRecent = recentSearches.filter(recent => 
    recent.toLowerCase().includes(queryLower)
  )
  matchingRecent.forEach(matchedQuery => {
    suggestions.push({
      id: `recent-matched-${matchedQuery}`,
      type: 'query',
      label: `Recent: ${matchedQuery}`,
      value: matchedQuery,
      icon: 'Clock'
    })
  })

  // Add matching categories
  const matchingCategories = categories.filter(category =>
    category.name.toLowerCase().includes(queryLower) ||
    category.description?.toLowerCase().includes(queryLower)
  ).slice(0, 3)

  matchingCategories.forEach(category => {
    suggestions.push({
      id: `category-${category.id}`,
      type: 'category',
      label: `Category: ${category.name}`,
      value: `category:${category.id}`,
      icon: 'FolderTree',
      count: prompts.filter(p => p.categoryId === category.id).length
    })
  })

  // Add matching tags
  const matchingTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(queryLower)
  ).slice(0, 5)

  matchingTags.forEach(tag => {
    suggestions.push({
      id: `tag-${tag.id}`,
      type: 'tag',
      label: `Tag: ${tag.name}`,
      value: `tag:${tag.name}`,
      icon: 'Tag',
      count: prompts.filter(p => p.tags.some(pTag => pTag.id === tag.id)).length
    })
  })

  // Add matching prompts
  const matchingPrompts = prompts
    .filter(prompt => {
      const matchesTitle = prompt.title.toLowerCase().includes(queryLower)
      const matchesDescription = prompt.description?.toLowerCase().includes(queryLower)
      const matchesContent = prompt.content.toLowerCase().includes(queryLower)
      return matchesTitle || matchesDescription || matchesContent
    })
    .slice(0, 5)

  matchingPrompts.forEach(prompt => {
    const category = categories.find(c => c.id === prompt.categoryId)
    const promptTags = tags.filter(t => prompt.tags.some(pTag => pTag.id === t.id))
    
    suggestions.push({
      id: `prompt-${prompt.id}`,
      type: 'prompt',
      label: prompt.title,
      value: prompt.title,
      icon: 'FileText',
      category: category?.name,
      tags: promptTags.map(t => t.name)
    })
  })

  return suggestions
}

/**
 * Apply search filters to prompts array
 */
export function filterPrompts(
  prompts: PromptType[],
  filters: SearchFilters
): PromptType[] {
  let filtered = [...prompts]

  // Text query filter
  if (filters.query.trim()) {
    const query = filters.query.toLowerCase()
    filtered = filtered.filter(prompt => {
      const title = prompt.title.toLowerCase()
      const description = prompt.description?.toLowerCase() || ''
      const content = prompt.content.toLowerCase()
      return title.includes(query) || description.includes(query) || content.includes(query)
    })
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(prompt => prompt.categoryId === filters.category)
  }

  // Tags filter
  if (filters.tags.length > 0) {
    filtered = filtered.filter(prompt =>
      filters.tags.every(tagName =>
        prompt.tags.some(promptTag => promptTag.name === tagName)
      )
    )
  }

  // Enhanced only filter
  if (filters.enhancedOnly) {
    filtered = filtered.filter(prompt => 
      prompt.metadata?.enhanced === true || 
      prompt.metadata?.aiEnhanced === true
    )
  }

  // Date range filter
  if (filters.dateRange) {
    filtered = filtered.filter(prompt => {
      const createdAt = new Date(prompt.createdAt)
      return createdAt >= filters.dateRange!.from && createdAt <= filters.dateRange!.to
    })
  }

  return filtered
}

/**
 * Sort filtered prompts based on sort options
 */
export function sortPrompts(
  prompts: PromptType[],
  sortBy: SearchFilters['sortBy'] = 'relevance',
  sortOrder: SearchFilters['sortOrder'] = 'desc'
): PromptType[] {
  const sorted = [...prompts].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      
      case 'name':
        comparison = a.title.localeCompare(b.title)
        break
      
      case 'usage':
        // Assuming usage is tracked in metadata
        const aUsage = a.metadata?.usageCount || 0
        const bUsage = b.metadata?.usageCount || 0
        comparison = aUsage - bUsage
        break
      
      case 'relevance':
      default:
        // For now, sort by updated date as proxy for relevance
        comparison = new Date(a.updatedAt || a.createdAt).getTime() - 
                    new Date(b.updatedAt || b.createdAt).getTime()
        break
    }

    return sortOrder === 'desc' ? -comparison : comparison
  })

  return sorted
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(
  text: string,
  searchQuery: string
): string {
  if (!searchQuery.trim()) return text

  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-vscode-yellow text-bg-primary">$1</mark>')
}

/**
 * Get search analytics and insights
 */
export function getSearchAnalytics(
  prompts: PromptType[],
  searchHistory: Array<{ query: string; timestamp: Date; resultCount: number }>
) {
  // Most searched terms
  const searchCounts: Record<string, number> = {}
  searchHistory.forEach(entry => {
    searchCounts[entry.query] = (searchCounts[entry.query] || 0) + 1
  })

  const topSearches = Object.entries(searchCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([query, count]) => ({ query, count }))

  // Popular categories in searches
  const categorySearches: Record<string, number> = {}
  searchHistory.forEach(entry => {
    if (entry.query.startsWith('category:')) {
      const categoryId = entry.query.replace('category:', '')
      const category = prompts.find(p => p.categoryId === categoryId)
      if (category) {
        categorySearches[category.name] = (categorySearches[category.name] || 0) + entry.resultCount
      }
    }
  })

  const popularCategories = Object.entries(categorySearches)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }))

  // Search success rate (searches that returned results)
  const successfulSearches = searchHistory.filter(entry => entry.resultCount > 0).length
  const totalSearches = searchHistory.length
  const successRate = totalSearches > 0 ? (successfulSearches / totalSearches) * 100 : 0

  return {
    topSearches,
    popularCategories,
    successRate,
    totalSearches,
    successfulSearches
  }
}

/**
 * Validate search filters
 */
export function validateSearchFilters(filters: SearchFilters): string[] {
  const errors: string[] = []

  // Query length validation
  if (filters.query.length > 200) {
    errors.push('Search query is too long (max 200 characters)')
  }

  // Date range validation
  if (filters.dateRange) {
    if (filters.dateRange.from > filters.dateRange.to) {
      errors.push('Date range start must be before end date')
    }

    const now = new Date()
    if (filters.dateRange.from > now || filters.dateRange.to > now) {
      errors.push('Date range cannot be in the future')
    }
  }

  // Tags validation
  if (filters.tags.length > 10) {
    errors.push('Too many tags selected (max 10)')
  }

  return errors
}

/**
 * Serialize filters for URL
 */
export function serializeFiltersForUrl(filters: SearchFilters): Record<string, string> {
  const params: Record<string, string> = {}

  if (filters.query) params.q = filters.query
  if (filters.category && filters.category !== 'all') params.category = filters.category
  if (filters.tags.length > 0) params.tags = filters.tags.join(',')
  if (filters.enhancedOnly) params.enhanced = 'true'
  if (filters.dateRange) {
    params.from = filters.dateRange.from.toISOString()
    params.to = filters.dateRange.to.toISOString()
  }
  if (filters.sortBy && filters.sortBy !== 'relevance') params.sortBy = filters.sortBy
  if (filters.sortOrder && filters.sortOrder !== 'desc') params.sortOrder = filters.sortOrder

  return params
}

/**
 * Parse filters from URL
 */
export function parseFiltersFromUrl(searchParams: URLSearchParams): SearchFilters {
  const filters: SearchFilters = {
    query: searchParams.get('q') || '',
    tags: [],
    sortBy: 'relevance',
    sortOrder: 'desc'
  }

  const category = searchParams.get('category')
  if (category && category !== 'all') {
    filters.category = category
  }

  const tags = searchParams.get('tags')
  if (tags) {
    filters.tags = tags.split(',').filter(Boolean)
  }

  const enhanced = searchParams.get('enhanced')
  if (enhanced === 'true') {
    filters.enhancedOnly = true
  }

  const from = searchParams.get('from')
  const to = searchParams.get('to')
  if (from && to) {
    filters.dateRange = {
      from: new Date(from),
      to: new Date(to)
    }
  }

  const sortBy = searchParams.get('sortBy') as SearchFilters['sortBy']
  if (sortBy && ['relevance', 'date', 'name', 'usage'].includes(sortBy)) {
    filters.sortBy = sortBy
  }

  const sortOrder = searchParams.get('sortOrder') as SearchFilters['sortOrder']
  if (sortOrder && ['asc', 'desc'].includes(sortOrder)) {
    filters.sortOrder = sortOrder
  }

  return filters
}