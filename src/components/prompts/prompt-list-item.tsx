'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { H3, Body, Caption, Typography } from '@/components/ui/typography'
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
  onEnhance?: (prompt: Prompt & { category: Category | null; tags: Tag[] }) => void
  onClick?: (prompt: Prompt & { category: Category | null; tags: Tag[] }) => void
}

export function PromptListItem({ 
  prompt, 
  onEdit, 
  onDelete,
  onEnhance,
  onClick 
}: PromptListItemProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copyToClipboard(prompt.content, `"${prompt.title}" copied!`)
  }
  
  return (
    <div
      className="vscode-card card-hover micro-interact p-4 flex items-start gap-4 hover:border-vscode-blue cursor-pointer group focus-ring focus:outline-none"
      onClick={() => onClick?.(prompt)}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(prompt)
        }
      }}
      aria-label={`Prompt: ${prompt.title}`}
    >
      {/* Enhanced color indicator with pulse */}
      <div className="relative flex-shrink-0">
        <div
          className="w-2 h-14 rounded-full transition-all duration-200 group-hover:scale-110"
          style={{ backgroundColor: prompt.color }}
        />
        <div
          className="absolute inset-0 w-2 h-14 rounded-full animate-pulse opacity-30"
          style={{ backgroundColor: prompt.color }}
        />
      </div>

      {/* Enhanced Content */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Title section with enhanced typography */}
        <div className="flex items-center gap-3">
          <H3 weight="semibold" className="truncate group-hover:text-vscode-blue transition-colors duration-200">
            {prompt.title}
          </H3>

          {prompt.isEnhanced && (
            <Badge
              variant="outline"
              className="text-xs text-vscode-blue border-vscode-blue flex-shrink-0 bg-vscode-blue/5 hover:bg-vscode-blue/10 transition-colors duration-200"
            >
              <Sparkles className="mr-1 h-3 w-3 animate-pulse" />
              <Typography variant="caption" weight="medium">AI</Typography>
            </Badge>
          )}
        </div>

        {/* Enhanced content preview */}
        <div className="group-hover:bg-bg-tertiary/50 p-3 rounded-sm transition-colors duration-200">
          <Typography
            variant="body-sm"
            color="secondary"
            className="font-mono truncate leading-relaxed"
            title={prompt.content}
          >
            {prompt.content}
          </Typography>
        </div>

        {/* Enhanced tags and categories */}
        <div className="flex items-center gap-2 flex-wrap">
          {prompt.category && (
            <Badge
              variant="outline"
              className="text-xs font-medium transition-all duration-200 hover:scale-105 border-opacity-60"
              style={{
                borderColor: prompt.category.color + '99',
                color: prompt.category.color,
                backgroundColor: prompt.category.color + '11'
              }}
            >
              <Typography variant="caption" weight="medium">
                {prompt.category.name}
              </Typography>
            </Badge>
          )}

          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="text-xs bg-bg-tertiary hover:bg-bg-elevated transition-all duration-200 hover:scale-105"
            >
              <Typography variant="caption">
                {tag.name}
              </Typography>
            </Badge>
          ))}

          {prompt.tags.length > 3 && (
            <Caption color="muted" className="px-2 py-1 bg-bg-tertiary rounded-sm">
              +{prompt.tags.length - 3} more
            </Caption>
          )}
        </div>
      </div>
      
      {/* Enhanced Actions */}
      <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className={`h-10 w-10 p-0 button-interactive focus-smooth rounded-sm ${
            isCopied ? 'success-feedback' : 'micro-interact'
          } hover:bg-vscode-blue/10 hover:text-vscode-blue`}
          title={isCopied ? "Copied!" : "Copy prompt"}
          aria-label={isCopied ? "Prompt copied" : "Copy prompt"}
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-vscode-green icon-bounce" />
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
          className="h-10 w-10 p-0 button-interactive micro-interact hover:bg-vscode-blue/10 hover:text-vscode-blue focus-smooth rounded-sm"
          title="Edit prompt"
          aria-label="Edit prompt"
        >
          <Edit className="h-4 w-4" />
        </Button>

        {onEnhance && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onEnhance(prompt)
            }}
            className="h-10 w-10 p-0 button-interactive micro-interact hover:bg-vscode-blue/10 hover:text-vscode-blue focus-smooth rounded-sm glow-subtle"
            title="Enhance with AI"
            aria-label="Enhance prompt with AI"
          >
            <Sparkles className="h-4 w-4 pulse-gentle" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 button-interactive micro-interact hover:bg-bg-tertiary focus-smooth rounded-sm"
              onClick={(e) => e.stopPropagation()}
              title="More options"
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-bg-secondary border-bdr-default shadow-lg modal-content"
          >
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDelete(prompt.id)
              }}
              className="text-vscode-red focus:text-vscode-red focus:bg-vscode-red/10 transition-colors duration-200"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <Typography variant="body-sm">Delete</Typography>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
