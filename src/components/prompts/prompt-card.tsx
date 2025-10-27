'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { 
  Copy, 
  Check, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Sparkles
} from 'lucide-react'
import type { Prompt, Category, Tag } from '@/types/prompt'

interface PromptCardProps {
  prompt: Prompt & { category: Category | null; tags: Tag[] }
  onEdit: (prompt: Prompt & { category: Category | null; tags: Tag[] }) => void
  onDelete: (id: string) => void
  onEnhance?: (prompt: Prompt & { category: Category | null; tags: Tag[] }) => void
  onClick?: (prompt: Prompt & { category: Category | null; tags: Tag[] }) => void
}

export function PromptCard({ 
  prompt, 
  onEdit, 
  onDelete,
  onEnhance,
  onClick 
}: PromptCardProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const [isHovered, setIsHovered] = useState(false)
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    copyToClipboard(prompt.content, `"${prompt.title}" copied!`)
  }
  
  const handleCardClick = () => {
    if (onClick) {
      onClick(prompt)
    }
  }
  
  return (
    <Card
      className="vscode-card p-4 relative cursor-pointer transition-all duration-150 hover:border-vscode-blue group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Color indicator */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
        style={{ backgroundColor: prompt.color }}
      />
      
      {/* Header with title and actions */}
      <div className="flex items-start justify-between gap-2 mb-3 ml-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-txt-primary truncate mb-1">
            {prompt.title}
          </h3>
          {prompt.description && (
            <p className="text-sm text-txt-secondary line-clamp-1">
              {prompt.description}
            </p>
          )}
        </div>
        
        {/* Actions - visible on hover */}
        <div className={`flex items-center gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {/* Quick copy button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0 hover:bg-bg-elevated"
            title="Copy content"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-vscode-green" />
            ) : (
              <Copy className="h-4 w-4 text-txt-secondary" />
            )}
          </Button>
          
          {/* More actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-bg-elevated"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-txt-secondary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-bg-secondary border-bdr-default">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(prompt)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {onEnhance && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEnhance(prompt)
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enhance with AI
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy(e)
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Content
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(prompt.id)
                }}
                className="text-vscode-red focus:text-vscode-red"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Content preview */}
      <div className="ml-3 mb-3">
        <p className="text-sm text-txt-secondary line-clamp-3 font-mono">
          {prompt.content}
        </p>
      </div>
      
      {/* Footer with category and tags */}
      <div className="ml-3 flex flex-wrap items-center gap-2">
        {prompt.category && (
          <Badge
            variant="outline"
            className="text-xs"
            style={{ 
              borderColor: prompt.category.color,
              color: prompt.category.color 
            }}
          >
            {prompt.category.name}
          </Badge>
        )}
        
        {prompt.tags.slice(0, 3).map((tag) => (
          <Badge key={tag.id} variant="secondary" className="text-xs">
            {tag.name}
          </Badge>
        ))}
        
        {prompt.tags.length > 3 && (
          <Badge variant="secondary" className="text-xs text-txt-muted">
            +{prompt.tags.length - 3} more
          </Badge>
        )}
        
        {/* AI enhanced indicator */}
        {prompt.isEnhanced && (
          <Badge variant="outline" className="text-xs text-vscode-blue border-vscode-blue">
            <Sparkles className="mr-1 h-3 w-3" />
            AI Enhanced
          </Badge>
        )}
      </div>
    </Card>
  )
}
