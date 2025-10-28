'use client'

import React, { useState, useEffect } from 'react'
import { 
  Star, 
  Clock, 
  Grid3X3, 
  List, 
  MoreHorizontal,
  Download,
  Trash2,
  Tag,
  Bookmark,
  TrendingUp,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Prompt } from '@/types/prompt'

interface QuickActionsProps {
  currentView: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
  favoritePrompts: Prompt[]
  recentPrompts: Prompt[]
  selectedPrompts: string[]
  onFavoriteToggle: (promptId: string) => void
  onRecentPromptSelect: (prompt: Prompt) => void
  onBulkAction: (action: BulkAction, promptIds: string[]) => void
  className?: string
}

type BulkAction = 'export' | 'delete' | 'add-tag' | 'remove-tag' | 'duplicate'

interface DropdownOption {
  id: BulkAction
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  variant?: 'default' | 'destructive'
  requiresSelection?: boolean
}

const bulkActions: DropdownOption[] = [
  {
    id: 'export',
    label: 'Export Selected',
    icon: Download,
    description: 'Download selected prompts as JSON',
    requiresSelection: true
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: Bookmark,
    description: 'Create copies of selected prompts',
    requiresSelection: true
  },
  {
    id: 'add-tag',
    label: 'Add Tags',
    icon: Tag,
    description: 'Add tags to selected prompts',
    requiresSelection: true
  },
  {
    id: 'remove-tag',
    label: 'Remove Tags',
    icon: Tag,
    description: 'Remove tags from selected prompts',
    requiresSelection: true
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: Trash2,
    description: 'Delete selected prompts permanently',
    variant: 'destructive',
    requiresSelection: true
  }
]

export function QuickActions({
  currentView,
  onViewChange,
  favoritePrompts,
  recentPrompts,
  selectedPrompts,
  onFavoriteToggle,
  onRecentPromptSelect,
  onBulkAction,
  className
}: QuickActionsProps) {
  const [showFavorites, setShowFavorites] = useState(false)
  const [showRecent, setShowRecent] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [favoritesExpanded, setFavoritesExpanded] = useState(false)
  const [recentExpanded, setRecentExpanded] = useState(false)

  // Get time-based grouping for recent prompts
  const groupRecentPrompts = (prompts: Prompt[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const groups = {
      today: [] as Prompt[],
      yesterday: [] as Prompt[],
      thisWeek: [] as Prompt[],
      older: [] as Prompt[]
    }

    prompts.forEach(prompt => {
      const promptDate = new Date(prompt.updatedAt || prompt.createdAt)
      if (promptDate >= today) {
        groups.today.push(prompt)
      } else if (promptDate >= yesterday) {
        groups.yesterday.push(prompt)
      } else if (promptDate >= thisWeek) {
        groups.thisWeek.push(prompt)
      } else {
        groups.older.push(prompt)
      }
    })

    return groups
  }

  const recentGroups = groupRecentPrompts(recentPrompts.slice(0, 10))

  // Format time for display
  const formatTime = (date: string) => {
    const now = new Date()
    const promptDate = new Date(date)
    const diffMs = now.getTime() - promptDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return promptDate.toLocaleDateString()
  }

  // Handle bulk action
  const handleBulkAction = (action: BulkAction) => {
    if (selectedPrompts.length === 0) return
    onBulkAction(action, selectedPrompts)
    setShowBulkActions(false)
  }

  // Render time group section
  const renderTimeGroup = (title: string, prompts: Prompt[], icon: React.ReactNode) => {
    if (prompts.length === 0) return null

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-txt-muted uppercase tracking-wide">
          {icon}
          {title}
        </div>
        <div className="space-y-1">
          {prompts.slice(0, 3).map(prompt => (
            <button
              key={prompt.id}
              onClick={() => onRecentPromptSelect(prompt)}
              className="w-full text-left px-2 py-2 hover:bg-bg-tertiary rounded-sm transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-txt-primary truncate group-hover:text-txt-secondary">
                    {prompt.title}
                  </div>
                  <div className="text-xs text-txt-muted">
                    {formatTime(prompt.updatedAt || prompt.createdAt)}
                  </div>
                </div>
                {prompt.categoryId && (
                  <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                    {prompt.categoryId.slice(0, 3)}
                  </Badge>
                )}
              </div>
            </button>
          ))}
          {prompts.length > 3 && (
            <button
              onClick={() => setRecentExpanded(!recentExpanded)}
              className="w-full text-left px-2 py-1 text-xs text-vscode-blue hover:text-vscode-blue-light transition-colors"
            >
              {recentExpanded ? 'Show less' : `Show ${prompts.length - 3} more`}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* View Toggle */}
      <div className="flex items-center gap-1 bg-bg-tertiary rounded-sm p-1">
        <Button
          variant={currentView === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('grid')}
          className="p-2"
          aria-label="Grid view"
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={currentView === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('list')}
          className="p-2"
          aria-label="List view"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      {/* Favorites Dropdown */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFavorites(!showFavorites)}
          className="gap-2"
          aria-label="Favorites"
        >
          <Star className={cn(
            "w-4 h-4",
            favoritePrompts.length > 0 ? "text-vscode-yellow fill-vscode-yellow" : "text-txt-muted"
          )} />
          <span className="hidden sm:inline">Favorites</span>
          {favoritePrompts.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {favoritePrompts.length}
            </Badge>
          )}
        </Button>

        {showFavorites && (
          <div className="absolute top-full left-0 mt-1 w-80 bg-bg-secondary border border-bdr-default rounded-sm shadow-lg z-50">
            <div className="p-3 border-b border-bdr-default">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-txt-primary">Favorite Prompts</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFavoritesExpanded(!favoritesExpanded)}
                  className="p-1"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {favoritePrompts.length === 0 ? (
                <div className="p-4 text-center text-txt-muted">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No favorite prompts yet</p>
                  <p className="text-xs mt-1">Click the star icon on any prompt to add it here</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {favoritePrompts.slice(0, favoritesExpanded ? undefined : 5).map(prompt => (
                    <button
                      key={prompt.id}
                      onClick={() => {
                        onRecentPromptSelect(prompt)
                        setShowFavorites(false)
                      }}
                      className="w-full text-left p-2 hover:bg-bg-tertiary rounded-sm transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-txt-primary truncate group-hover:text-txt-secondary">
                            {prompt.title}
                          </div>
                          <div className="text-xs text-txt-muted">
                            {formatTime(prompt.updatedAt || prompt.createdAt)}
                          </div>
                        </div>
                        <Star 
                          className="w-4 h-4 text-vscode-yellow fill-vscode-yellow flex-shrink-0 ml-2"
                        />
                      </div>
                    </button>
                  ))}
                  {favoritePrompts.length > 5 && !favoritesExpanded && (
                    <button
                      onClick={() => setFavoritesExpanded(true)}
                      className="w-full text-left px-2 py-1 text-xs text-vscode-blue hover:text-vscode-blue-light transition-colors"
                    >
                      Show {favoritePrompts.length - 5} more
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Prompts Dropdown */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRecent(!showRecent)}
          className="gap-2"
          aria-label="Recent prompts"
        >
          <Clock className="w-4 h-4 text-txt-muted" />
          <span className="hidden sm:inline">Recent</span>
          {recentPrompts.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {recentPrompts.length}
            </Badge>
          )}
        </Button>

        {showRecent && (
          <div className="absolute top-full right-0 mt-1 w-80 bg-bg-secondary border border-bdr-default rounded-sm shadow-lg z-50">
            <div className="p-3 border-b border-bdr-default">
              <h3 className="text-sm font-medium text-txt-primary">Recent Prompts</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {recentPrompts.length === 0 ? (
                <div className="p-4 text-center text-txt-muted">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent prompts</p>
                </div>
              ) : (
                <div className="p-2 space-y-3">
                  {renderTimeGroup('Today', recentGroups.today, <Zap className="w-3 h-3" />)}
                  {renderTimeGroup('Yesterday', recentGroups.yesterday, <Clock className="w-3 h-3" />)}
                  {renderTimeGroup('This Week', recentGroups.thisWeek, <TrendingUp className="w-3 h-3" />)}
                  {recentGroups.older.length > 0 && renderTimeGroup('Older', recentGroups.older, <Clock className="w-3 h-3" />)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Dropdown */}
      {selectedPrompts.length > 0 && (
        <div className="relative">
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowBulkActions(!showBulkActions)}
            className="gap-2"
            aria-label={`${selectedPrompts.length} selected prompts`}
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Bulk Actions</span>
            <Badge variant="outline" className="text-xs">
              {selectedPrompts.length}
            </Badge>
          </Button>

          {showBulkActions && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-bg-secondary border border-bdr-default rounded-sm shadow-lg z-50">
              <div className="p-3 border-b border-bdr-default">
                <h3 className="text-sm font-medium text-txt-primary">
                  Actions for {selectedPrompts.length} prompts
                </h3>
              </div>
              <div className="p-2">
                {bulkActions
                  .filter(action => !action.requiresSelection || selectedPrompts.length > 0)
                  .map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleBulkAction(action.id)}
                      className={cn(
                        "w-full text-left p-2 hover:bg-bg-tertiary rounded-sm transition-colors",
                        "flex items-center gap-3",
                        action.variant === 'destructive' && "text-vscode-red hover:bg-vscode-red/10"
                      )}
                    >
                      <action.icon className="w-4 h-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{action.label}</div>
                        <div className="text-xs text-txt-muted">{action.description}</div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="hidden lg:flex items-center gap-2 text-sm text-txt-muted">
        <span>{favoritePrompts.length} favorites</span>
        <span>•</span>
        <span>{recentPrompts.length} recent</span>
        {selectedPrompts.length > 0 && (
          <>
            <span>•</span>
            <span className="text-vscode-blue">{selectedPrompts.length} selected</span>
          </>
        )}
      </div>
    </div>
  )
}

// Hook for managing favorites
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('prompt-manager-favorites')
      if (stored) {
        const parsed = JSON.parse(stored)
        setFavorites(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.warn('Failed to load favorites:', error)
    }
  }, [])

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites)
    try {
      localStorage.setItem('prompt-manager-favorites', JSON.stringify(newFavorites))
    } catch (error) {
      console.warn('Failed to save favorites:', error)
    }
  }

  const toggleFavorite = (promptId: string) => {
    const newFavorites = favorites.includes(promptId)
      ? favorites.filter(id => id !== promptId)
      : [...favorites, promptId]
    saveFavorites(newFavorites)
    return newFavorites.includes(promptId)
  }

  const isFavorite = (promptId: string) => favorites.includes(promptId)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoriteCount: favorites.length
  }
}

// Hook for managing recent prompts
export function useRecentPrompts(maxItems: number = 20) {
  const [recentPrompts, setRecentPrompts] = useState<Array<{ id: string; timestamp: Date }>>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('prompt-manager-recent')
      if (stored) {
        const parsed = JSON.parse(stored)
        setRecentPrompts(Array.isArray(parsed) ? parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })) : [])
      }
    } catch (error) {
      console.warn('Failed to load recent prompts:', error)
    }
  }, [])

  const addRecentPrompt = (promptId: string) => {
    setRecentPrompts(prev => {
      const filtered = prev.filter(item => item.id !== promptId)
      const newRecent = [{ id: promptId, timestamp: new Date() }, ...filtered]
      const limited = newRecent.slice(0, maxItems)
      
      try {
        localStorage.setItem('prompt-manager-recent', JSON.stringify(limited))
      } catch (error) {
        console.warn('Failed to save recent prompts:', error)
      }
      
      return limited
    })
  }

  const clearRecent = () => {
    setRecentPrompts([])
    try {
      localStorage.removeItem('prompt-manager-recent')
    } catch (error) {
      console.warn('Failed to clear recent prompts:', error)
    }
  }

  return {
    recentPrompts,
    addRecentPrompt,
    clearRecent,
    recentCount: recentPrompts.length
  }
}