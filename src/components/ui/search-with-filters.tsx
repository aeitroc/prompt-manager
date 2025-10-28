'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, X, Filter, ChevronDown, Calendar, Tag, FolderTree, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSearchDebounced, useRecentSearches, useSearchHistory } from '@/hooks/use-search-debounced'
import type { SearchFilters, SearchSuggestion } from '@/types/search'
import type { Category, Tag as TagType, Prompt } from '@/types/prompt'
import { generateSearchSuggestions, validateSearchFilters, highlightSearchTerms } from '@/lib/search-utils'

interface EnhancedSearchProps {
  prompts: Prompt[]
  categories: Category[]
  tags: TagType[]
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSearch?: (filters: SearchFilters) => void
  placeholder?: string
  className?: string
  showAdvancedFilters?: boolean
  autoFocus?: boolean
}

export function EnhancedSearch({
  prompts,
  categories,
  tags,
  filters,
  onFiltersChange,
  onSearch,
  placeholder = "Search prompts...",
  className,
  showAdvancedFilters = true,
  autoFocus = false
}: EnhancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [errors, setErrors] = useState<string[]>([])
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const { recentSearches, addRecentSearch } = useRecentSearches()
  const { addSearchToHistory } = useSearchHistory()

  // Generate suggestions based on current query
  const suggestions = useMemo(() => {
    return generateSearchSuggestions(prompts, categories, tags, filters.query, recentSearches)
  }, [prompts, categories, tags, filters.query, recentSearches])

  // Debounced search effect
  useSearchDebounced(
    filters.query,
    300,
    (query) => {
      const newFilters = { ...filters, query }
      setErrors(validateSearchFilters(newFilters))
      
      // Add to search history
      if (query.trim()) {
        addRecentSearch(query)
        addSearchToHistory(query, 0) // Will be updated with actual count
        onSearch?.(newFilters)
      }
    }
  )

  // Handle input change
  const handleInputChange = (value: string) => {
    onFiltersChange({ ...filters, query: value })
    setSelectedSuggestionIndex(-1)
    
    // Open suggestions if there's input or recent searches
    setIsOpen(value.length > 0 || recentSearches.length > 0)
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    const newFilters = { ...filters }
    
    switch (suggestion.type) {
      case 'query':
        newFilters.query = suggestion.value
        break
      case 'category':
        newFilters.category = suggestion.value.replace('category:', '')
        newFilters.query = '' // Clear query when selecting category
        break
      case 'tag':
        // Add tag to existing tags if not already present
        const tagName = suggestion.value.replace('tag:', '')
        if (!newFilters.tags.includes(tagName)) {
          newFilters.tags = [...newFilters.tags, tagName]
        }
        break
      case 'prompt':
        newFilters.query = suggestion.value
        break
    }
    
    onFiltersChange(newFilters)
    setIsOpen(false)
    searchInputRef.current?.focus()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex])
        } else {
          // Regular search
          const newFilters = { ...filters }
          onSearch?.(newFilters)
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedSuggestionIndex(-1)
        searchInputRef.current?.blur()
        break
    }
  }

  // Clear search
  const clearSearch = () => {
    onFiltersChange({ ...filters, query: '' })
    setIsOpen(false)
    setSelectedSuggestionIndex(-1)
    searchInputRef.current?.focus()
  }

  // Handle tag removal
  const removeTag = (tagToRemove: string) => {
    const newTags = filters.tags.filter(tag => tag !== tagToRemove)
    onFiltersChange({ ...filters, tags: newTags })
  }

  // Handle enhanced filter toggle
  const toggleEnhancedOnly = () => {
    onFiltersChange({ ...filters, enhancedOnly: !filters.enhancedOnly })
  }

  // Handle category filter
  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({ 
      ...filters, 
      category: categoryId === 'all' ? undefined : categoryId 
    })
  }

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.category) count++
    if (filters.tags.length > 0) count++
    if (filters.enhancedOnly) count++
    return count
  }, [filters])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedSuggestionIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Search className="w-4 h-4 text-txt-muted" />
        </div>
        
        <input
          ref={searchInputRef}
          type="text"
          placeholder={placeholder}
          value={filters.query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(filters.query.length > 0 || recentSearches.length > 0)}
          autoFocus={autoFocus}
          className={cn(
            "w-full pl-10 pr-24 py-2 bg-bg-tertiary border border-bdr-subtle",
            "rounded-sm text-sm text-txt-primary",
            "focus:border-vscode-blue focus:ring-1 focus:ring-vscode-blue",
            "placeholder:text-txt-muted transition-colors",
            errors.length > 0 && "border-vscode-red focus:border-vscode-red focus:ring-vscode-red"
          )}
        />
        
        {/* Clear button */}
        {filters.query && (
          <button
            onClick={clearSearch}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-txt-muted hover:text-txt-primary transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Filters button */}
        {showAdvancedFilters && (
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={cn(
              "absolute right-8 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors",
              activeFiltersCount > 0 
                ? "text-vscode-blue hover:text-vscode-blue-light" 
                : "text-txt-muted hover:text-txt-secondary"
            )}
            aria-label="Search filters"
          >
            <Filter className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <Badge 
                variant="outline" 
                className="absolute -top-2 -right-2 w-5 h-5 text-xs p-0 flex items-center justify-center"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-bg-secondary border border-bdr-default 
                   rounded-sm shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-bg-tertiary transition-colors",
                "flex items-center gap-3 border-b border-bdr-subtle last:border-b-0",
                index === selectedSuggestionIndex && "bg-bg-tertiary"
              )}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Icon based on type */}
                {suggestion.icon === 'Clock' && <Clock className="w-4 h-4 text-txt-muted flex-shrink-0" />}
                {suggestion.icon === 'FolderTree' && <FolderTree className="w-4 h-4 text-vscode-blue flex-shrink-0" />}
                {suggestion.icon === 'Tag' && <Tag className="w-4 h-4 text-vscode-yellow flex-shrink-0" />}
                {suggestion.icon === 'FileText' && <Search className="w-4 h-4 text-vscode-green flex-shrink-0" />}
                {suggestion.icon === 'TrendingUp' && <TrendingUp className="w-4 h-4 text-vscode-red flex-shrink-0" />}
                
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-txt-primary truncate">
                    {highlightSearchTerms(suggestion.label, filters.query)}
                  </div>
                  {(suggestion.category || suggestion.tags) && (
                    <div className="flex items-center gap-2 mt-1">
                      {suggestion.category && (
                        <Badge variant="outline" className="text-xs">
                          {suggestion.category}
                        </Badge>
                      )}
                      {suggestion.tags?.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {suggestion.count && (
                <Badge variant="outline" className="text-xs text-txt-muted">
                  {suggestion.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && isFiltersOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-bg-secondary border border-bdr-default 
                       rounded-sm shadow-lg z-40 p-4 space-y-4">
          
          {/* Active tags display */}
          {filters.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-txt-primary mb-2">Active Tags</label>
              <div className="flex flex-wrap gap-2">
                {filters.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-vscode-red hover:text-white"
                    onClick={() => removeTag(tag)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-txt-primary mb-2">Category</label>
            <select
              value={filters.category || 'all'}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 bg-bg-tertiary border border-bdr-subtle rounded-sm text-sm 
                       text-txt-primary focus:border-vscode-blue focus:ring-1 focus:ring-vscode-blue"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({prompts.filter(p => p.categoryId === category.id).length})
                </option>
              ))}
            </select>
          </div>
          
          {/* Enhanced only filter */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enhanced-only"
              checked={filters.enhancedOnly || false}
              onChange={toggleEnhancedOnly}
              className="w-4 h-4 text-vscode-blue bg-bg-tertiary border-bdr-subtle rounded 
                       focus:ring-vscode-blue focus:ring-2"
            />
            <label htmlFor="enhanced-only" className="text-sm text-txt-primary">
              AI Enhanced Only
            </label>
          </div>
          
          {/* Validation errors */}
          {errors.length > 0 && (
            <div className="text-sm text-vscode-red">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
          
          {/* Clear filters */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onFiltersChange({
                  query: '',
                  tags: [],
                  sortBy: 'relevance',
                  sortOrder: 'desc'
                })
                setIsFiltersOpen(false)
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}