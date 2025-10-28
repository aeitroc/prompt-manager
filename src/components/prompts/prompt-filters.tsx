'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { useCategories } from '@/hooks/use-categories'
import { useTags } from '@/hooks/use-tags'

interface PromptFiltersProps {
  filters: {
    category: string
    tags: string[]
  }
  onFilterChange: (filters: any) => void
}

export function PromptFilters({ filters, onFilterChange }: PromptFiltersProps) {
  const { categories } = useCategories()
  const { tags: allTags } = useTags()
  
  const handleClearFilters = () => {
    onFilterChange({ category: 'all', tags: [] })
  }
  
  const hasActiveFilters = filters.category !== 'all' || filters.tags.length > 0
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        {/* Filters */}
        <div className="flex-1 flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Category filter */}
          <Select
            value={filters.category}
            onValueChange={(val) => onFilterChange({ ...filters, category: val })}
          >
            <SelectTrigger className="vscode-input w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-bg-secondary border-bdr-default">
              <SelectItem value="all">All Categories</SelectItem>
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
          
          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-txt-secondary hover:text-txt-primary"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {/* Active tag filters */}
      {filters.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.tags.map((tagId) => {
            const tag = allTags.find(t => t.id === tagId)
            if (!tag) return null
            
            return (
              <Badge
                key={tagId}
                variant="secondary"
                className="cursor-pointer hover:bg-bg-elevated"
                onClick={() => {
                  onFilterChange({
                    ...filters,
                    tags: filters.tags.filter(id => id !== tagId)
                  })
                }}
              >
                {tag.name}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
