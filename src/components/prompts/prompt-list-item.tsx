'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { 
  Copy, 
  Check, 
  Edit, 
  Trash2, 
  Sparkles,
  MoreVertical 
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Prompt, Category, Tag } from '@/types/prompt'

interface PromptListItemProps {
  prompt: Prompt & { category: Category | null; tags: Tag[] }
  onEdit: (prompt: Prompt & { category: Category | null; tags: Tag[] }) => void
  onDelete: (id: string) => void
  onClick?: (prompt: Prompt & { category: Category | null; tags: Tag[] }) => void
}

export function PromptListItem({ 
  prompt, 
  onEdit, 
  onDelete, 
  onClick 
}: PromptListItemProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copyToClipboard(prompt.content, `"${prompt.title}" copied!`)
  }
  
  return (
    <div
      className="vscode-card p-3 flex items-center gap-3 hover:border-vscode-blue cursor-pointer group"
      onClick={() => onClick?.(prompt)}
    >
      {/* Color indicator */}
      <div
        className="w-1 h-12 rounded flex-shrink-0"
        style={{ backgroundColor: prompt.color }}
      />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-txt-primary truncate">
            {prompt.title}
          </h3>
          
          {prompt.isEnhanced && (
            <Badge variant="outline" className="text-xs text-vscode-blue border-vscode-blue flex-shrink-0">
              <Sparkles className="mr-1 h-3 w-3" />
              AI
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-txt-secondary truncate font-mono mb-2">
          {prompt.content}
        </p>
        
        <div className="flex items-center gap-2 flex-wrap">
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
          
          {prompt.tags.slice(0, 2).map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
          
          {prompt.tags.length > 2 && (
            <span className="text-xs text-txt-muted">
              +{prompt.tags.length - 2}
            </span>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
          title="Copy"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-vscode-green" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(prompt)
          }}
          className="h-8 w-8 p-0"
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-bg-secondary border-bdr-default">
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
  )
}
