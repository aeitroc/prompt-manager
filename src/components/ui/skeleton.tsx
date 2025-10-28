'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Base skeleton component for loading states
 */
export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-bg-tertiary rounded",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Header skeleton loading component
 */
export function HeaderSkeleton() {
  return (
    <header className="bg-bg-secondary border-b border-bdr-default sticky top-0 z-40">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left section - Logo and navigation */}
          <div className="flex items-center gap-4">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="w-32 h-6 rounded" />
            
            {/* Desktop navigation items */}
            <nav className="hidden md:flex items-center gap-1">
              <Skeleton className="w-20 h-8 rounded" />
              <Skeleton className="w-24 h-8 rounded" />
              <Skeleton className="w-16 h-8 rounded" />
            </nav>
          </div>

          {/* Center section - Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <Skeleton className="w-full h-10 rounded" />
          </div>

          {/* Right section - Stats and actions */}
          <div className="flex items-center gap-3">
            {/* Mobile/Tablet search button */}
            <Skeleton className="w-10 h-10 lg:hidden rounded" />
            
            {/* Statistics badges */}
            <div className="hidden sm:flex items-center gap-3">
              <Skeleton className="w-24 h-6 rounded" />
              <Skeleton className="w-28 h-6 rounded" />
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-24 h-8 sm:w-28 rounded" />
              <Skeleton className="w-10 h-10 rounded hidden md:flex" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

/**
 * Search box skeleton component
 */
export function SearchBoxSkeleton() {
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Skeleton className="w-4 h-4 rounded" />
      </div>
      <Skeleton className="w-full h-10 pl-10 pr-16 rounded" />
    </div>
  )
}

/**
 * Navigation item skeleton component
 */
export function NavigationItemSkeleton() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm">
      <Skeleton className="w-4 h-4 rounded" />
      <Skeleton className="w-16 h-4 rounded" />
    </div>
  )
}

/**
 * Badge skeleton component
 */
export function BadgeSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-6 rounded px-2", className)} />
}

/**
 * Prompt card skeleton for grid/list view
 */
export function PromptCardSkeleton({ layout = 'list' }: { layout?: 'grid' | 'list' }) {
  if (layout === 'grid') {
    return (
      <div className="bg-bg-secondary border border-bdr-subtle rounded-sm p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-32 h-4 rounded flex-1" />
          </div>
          <Skeleton className="w-16 h-6 rounded" />
        </div>
        
        <Skeleton className="w-full h-12 rounded" />
        
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-6 rounded" />
          <Skeleton className="w-12 h-6 rounded" />
          <Skeleton className="w-20 h-6 rounded" />
        </div>
        
        <div className="flex items-center gap-2 pt-2 border-t border-bdr-subtle">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="w-6 h-6 rounded" />
          <div className="flex-1" />
          <Skeleton className="w-8 h-4 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-secondary border border-bdr-subtle rounded-sm p-4">
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-48 h-5 rounded" />
            <Skeleton className="w-16 h-6 rounded" />
          </div>
          
          <Skeleton className="w-full h-16 rounded" />
          
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-6 rounded" />
            <Skeleton className="w-16 h-6 rounded" />
            <Skeleton className="w-24 h-6 rounded" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      </div>
    </div>
  )
}

/**
 * Statistics dashboard skeleton
 */
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-bg-secondary border border-bdr-subtle rounded-sm p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded" />
            <div className="space-y-2">
              <Skeleton className="w-16 h-4 rounded" />
              <Skeleton className="w-12 h-6 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Category/tag list skeleton
 */
export function CategoryTagListSkeleton({ 
  count = 5 
}: { 
  count?: number 
}) {
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-24 h-4 rounded" />
          </div>
          <Skeleton className="w-8 h-6 rounded" />
        </div>
      ))}
    </div>
  )
}

/**
 * Button skeleton for action areas
 */
export function ButtonSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 rounded", className)} />
}

/**
 * Loading spinner component for async operations
 */
export function LoadingSpinner({ 
  size = 'md', 
  className 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-t-vscode-blue border-bdr-default",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Pulsing loading dots for inline loading states
 */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-vscode-blue rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )
}

/**
 * Progress bar loading component
 */
export function LoadingProgress({ 
  progress = 0, 
  className,
  showPercentage = true 
}: { 
  progress?: number
  className?: string
  showPercentage?: boolean
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-vscode-blue transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-txt-muted text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

/**
 * Combined skeleton for complex components
 */
export function ComponentSkeleton({ 
  type,
  layout,
  count = 1
}: {
  type: 'header' | 'search' | 'prompt-card' | 'stats' | 'category-list'
  layout?: 'grid' | 'list'
  count?: number
}) {
  const skeletons = []
  
  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'header':
        skeletons.push(<HeaderSkeleton key={i} />)
        break
      case 'search':
        skeletons.push(<SearchBoxSkeleton key={i} />)
        break
      case 'prompt-card':
        skeletons.push(
          <PromptCardSkeleton key={i} layout={layout || 'list'} />
        )
        break
      case 'stats':
        skeletons.push(<StatsSkeleton key={i} />)
        break
      case 'category-list':
        skeletons.push(<CategoryTagListSkeleton key={i} />)
        break
    }
  }
  
  return <>{skeletons}</>
}