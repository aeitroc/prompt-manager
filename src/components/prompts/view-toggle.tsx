'use client'

import { Button } from '@/components/ui/button'
import { useViewStore } from '@/store/view-store'
import { LayoutGrid, List } from 'lucide-react'

export function ViewToggle() {
  const { viewMode, setViewMode } = useViewStore()
  
  return (
    <div className="flex items-center gap-1 bg-bg-secondary rounded p-1">
      <Button
        variant={viewMode === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('card')}
        className={`h-8 w-8 p-0 ${
          viewMode === 'card' 
            ? 'bg-vscode-blue text-white hover:bg-vscode-blue-light' 
            : 'text-txt-secondary hover:bg-bg-elevated'
        }`}
        title="Card view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('list')}
        className={`h-8 w-8 p-0 ${
          viewMode === 'list' 
            ? 'bg-vscode-blue text-white hover:bg-vscode-blue-light' 
            : 'text-txt-secondary hover:bg-bg-elevated'
        }`}
        title="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
