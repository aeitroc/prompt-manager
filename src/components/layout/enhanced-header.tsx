'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EnhancedSearch } from '@/components/ui/search-with-filters'
import { HeaderSkeleton } from '@/components/ui/skeleton'
import { H1, H2, H3, Body, Caption, Typography } from '@/components/ui/typography'
import {
  Sparkles,
  Menu,
  Search,
  FileText,
  FolderTree,
  Tag,
  Settings,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchFilters } from '@/types/search'
import type { Prompt, Category, Tag as TagType } from '@/types/prompt'


interface HeaderProps {
  prompts: Prompt[]
  categories: Category[]
  tags: TagType[]
  onManageCategories: () => void
  onManageTags: () => void
  onPromptSelect?: (prompt: Prompt) => void
  activeSection?: string
  onNavigate?: (section: string) => void
}

const navigationItems = [
  { id: 'prompts', label: 'Prompts', icon: FileText },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'tags', label: 'Tags', icon: Tag },
] as const

export function EnhancedHeader({
  prompts,
  categories,
  tags,
  onManageCategories,
  onManageTags,
  onPromptSelect,
  activeSection = 'prompts',
  onNavigate
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    sortBy: 'relevance',
    sortOrder: 'desc'
  })
  const [searchOpen, setSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Handle search with filters
  const handleSearch = (filters: SearchFilters) => {
    setIsLoading(true)
    // Simulate search delay for better UX
    setTimeout(() => {
      setIsLoading(false)
      // TODO: Implement actual search logic
      console.log('Searching with filters:', filters)
    }, 300)
  }

  // Handle navigation
  const handleNavigate = (section: string) => {
    onNavigate?.(section)
    setMobileMenuOpen(false)
  }

  
  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 0)
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
        setSearchFilters({ query: '', tags: [], sortBy: 'relevance', sortOrder: 'desc' })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  // Handle selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      // TODO: Handle text selection for bulk operations
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [])

  return (
    <>
      <header 
        className="bg-bg-secondary border-b border-bdr-default sticky top-0 z-40"
        role="banner"
      >
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 hover:bg-bg-elevated rounded-sm transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-5 h-5 text-txt-secondary" />
              </button>

              {/* Logo */}
              <a
                href="/"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                aria-label="Prompt Manager Home"
              >
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-vscode-blue group-hover:text-vscode-blue-light transition-colors duration-200" strokeWidth={2} aria-hidden="true" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
                </div>
                <Typography variant="h3" weight="semibold" className="tracking-tight">
                  Prompt Manager
                </Typography>
              </a>

              {/* Desktop Navigation */}
              <nav 
                className="hidden md:flex items-center gap-1" 
                aria-label="Main navigation"
              >
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium",
                      "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-vscode-blue",
                      activeSection === item.id
                        ? "bg-bg-elevated text-txt-primary"
                        : "text-txt-secondary hover:text-txt-primary hover:bg-bg-tertiary"
                    )}
                  >
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Center Section - Enhanced Search (Desktop) */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <EnhancedSearch
                prompts={prompts}
                categories={categories}
                tags={tags}
                filters={searchFilters}
                onFiltersChange={setSearchFilters}
                onSearch={handleSearch}
                placeholder="Search prompts... (⌘K)"
                showAdvancedFilters={true}
              />
            </div>

            {/* Right Section - Stats, Quick Actions, and Primary Actions */}
            <div className="flex items-center gap-3">
              {/* Search button (Mobile/Tablet) */}
              <button
                className="lg:hidden p-2 hover:bg-bg-elevated rounded-sm transition-colors"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="w-5 h-5 text-txt-secondary" />
              </button>

              
              {/* Settings button */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

                  </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-bg-primary/80 z-50 md:hidden">
          <div className="fixed left-0 top-0 h-full w-72 bg-bg-secondary border-r border-bdr-default">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-6 border-b border-bdr-default bg-gradient-to-r from-bg-secondary to-bg-tertiary">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-vscode-blue" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
                <Typography variant="h3" weight="semibold">Menu</Typography>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 hover:bg-bg-elevated rounded-sm transition-all duration-200 hover:scale-105"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-txt-secondary" />
              </button>
            </div>

            {/* Mobile navigation */}
            <nav className="flex flex-col p-4" aria-label="Mobile navigation">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium",
                    "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                    "border border-transparent hover:border-bdr-subtle",
                    activeSection === item.id
                      ? "bg-gradient-to-r from-vscode-blue/10 to-transparent text-txt-primary border-vscode-blue/30"
                      : "text-txt-secondary hover:text-txt-primary hover:bg-bg-tertiary"
                  )}
                >
                  <item.icon className="w-5 h-5 transition-colors duration-200" aria-hidden="true" />
                  <Typography weight="medium">{item.label}</Typography>
                </button>
              ))}
            </nav>

                      </div>

          {/* Overlay backdrop */}
          <div 
            className="absolute inset-0 bg-bg-primary/60" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Mobile Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-bg-primary/80 z-50 lg:hidden">
          <div className="fixed top-0 left-0 right-0 bg-bg-secondary border-b border-bdr-default p-4">
            <div className="relative mb-4">
              <EnhancedSearch
                prompts={prompts}
                categories={categories}
                tags={tags}
                filters={searchFilters}
                onFiltersChange={setSearchFilters}
                onSearch={handleSearch}
                placeholder="Search prompts..."
                showAdvancedFilters={true}
                autoFocus={true}
              />
            </div>
            
                      </div>
          
          <div 
            className="absolute inset-0 bg-bg-primary/60" 
            onClick={() => {
              setSearchOpen(false)
              setSearchFilters({ query: '', tags: [], sortBy: 'relevance', sortOrder: 'desc' })
            }}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  )
}