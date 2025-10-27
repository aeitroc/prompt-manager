'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Sparkles, 
  Menu, 
  Search, 
  FileText, 
  FolderTree, 
  Tag, 
  Settings,
  X
} from 'lucide-react'
import { useStats } from '@/hooks/use-stats'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onAddPrompt: () => void
  onManageCategories: () => void
  onManageTags: () => void
  activeSection?: string
  onNavigate?: (section: string) => void
}

const navigationItems = [
  { id: 'prompts', label: 'Prompts', icon: FileText },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'tags', label: 'Tags', icon: Tag },
] as const

export function Header({ 
  onAddPrompt, 
  onManageCategories, 
  onManageTags,
  activeSection = 'prompts',
  onNavigate 
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { stats, isLoading } = useStats()

  // Handle search with debouncing
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    // TODO: Implement search functionality with debouncing
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
        setSearchQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  const handleNavigate = (section: string) => {
    onNavigate?.(section)
    setMobileMenuOpen(false)
  }

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
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                aria-label="Prompt Manager Home"
              >
                <Sparkles className="w-6 h-6 text-vscode-blue" strokeWidth={2} aria-hidden="true" />
                <h1 className="text-xl font-semibold text-txt-primary tracking-tight">
                  Prompt Manager
                </h1>
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

            {/* Center Section - Search (Desktop) */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search 
                  className="absolute left-3 w-4 h-4 text-txt-muted pointer-events-none" 
                  aria-hidden="true" 
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search prompts... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-1.5 bg-bg-tertiary border border-bdr-subtle 
                           rounded-sm text-sm text-txt-primary
                           focus:border-vscode-blue focus:ring-1 focus:ring-vscode-blue
                           placeholder:text-txt-muted transition-colors"
                  aria-label="Search prompts"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-txt-muted hover:text-txt-primary transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Section - Stats and Actions */}
            <div className="flex items-center gap-3">
              {/* Search button (Mobile/Tablet) */}
              <button
                className="lg:hidden p-2 hover:bg-bg-elevated rounded-sm transition-colors"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="w-5 h-5 text-txt-secondary" />
              </button>

              {/* Statistics */}
              <div className="hidden sm:flex items-center gap-3">
                <Badge 
                  variant="outline" 
                  className="text-sm border-bdr-subtle text-txt-secondary"
                >
                  <FileText className="w-3 h-3 mr-1" aria-hidden="true" />
                  {isLoading ? '...' : stats.totalPrompts} prompts
                </Badge>
                <Badge 
                  variant="outline" 
                  className="text-sm text-vscode-blue border-vscode-blue bg-vscode-blue/10"
                >
                  <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
                  {isLoading ? '...' : stats.enhancedPrompts} AI enhanced
                </Badge>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={onAddPrompt}
                  className="vscode-button-primary"
                  aria-label="Create new prompt"
                >
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">New Prompt</span>
                  <span className="sm:hidden">New</span>
                </Button>
                
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
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-bg-primary/80 z-50 md:hidden">
          <div className="fixed left-0 top-0 h-full w-72 bg-bg-secondary border-r border-bdr-default">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-6 border-b border-bdr-default">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-vscode-blue" />
                <h2 className="text-lg font-semibold text-txt-primary">Menu</h2>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-bg-elevated rounded-sm transition-colors"
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
                    "transition-all duration-150",
                    activeSection === item.id
                      ? "bg-bg-elevated text-txt-primary"
                      : "text-txt-secondary hover:text-txt-primary hover:bg-bg-tertiary"
                  )}
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile search */}
            <div className="p-4 border-t border-bdr-default">
              <div className="relative">
                <Search className="absolute left-3 w-4 h-4 text-txt-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-bg-tertiary border border-bdr-subtle 
                           rounded-sm text-sm text-txt-primary
                           focus:border-vscode-blue focus:ring-1 focus:ring-vscode-blue
                           placeholder:text-txt-muted"
                  aria-label="Search prompts"
                />
              </div>
            </div>

            {/* Mobile stats */}
            <div className="p-4 border-t border-bdr-default">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm">
                    <FileText className="w-3 h-3 mr-1" />
                    {isLoading ? '...' : stats.totalPrompts} prompts
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm text-vscode-blue border-vscode-blue">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {isLoading ? '...' : stats.enhancedPrompts} AI enhanced
                  </Badge>
                </div>
              </div>
            </div>
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
            <div className="relative">
              <Search className="absolute left-3 w-4 h-4 text-txt-muted pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-12 py-2 bg-bg-tertiary border border-bdr-subtle 
                         rounded-sm text-sm text-txt-primary
                         focus:border-vscode-blue focus:ring-1 focus:ring-vscode-blue
                         placeholder:text-txt-muted"
                aria-label="Search prompts"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery('')
                }}
                className="absolute right-3 text-txt-muted hover:text-txt-primary transition-colors"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div 
            className="absolute inset-0 bg-bg-primary/60" 
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  )
}
