'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { Copy, Check, ArrowRight } from 'lucide-react'

interface PromptComparisonProps {
  original: string
  enhanced: string
  model?: string
}

export function PromptComparison({ original, enhanced, model }: PromptComparisonProps) {
  const { copyToClipboard: copyOriginal, isCopied: isOriginalCopied } = useCopyToClipboard()
  const { copyToClipboard: copyEnhanced, isCopied: isEnhancedCopied } = useCopyToClipboard()
  
  return (
    <div className="space-y-4">
      {model && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-txt-secondary">Enhanced by:</span>
          <Badge variant="outline">{model}</Badge>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <Card className="vscode-card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-txt-secondary">Original</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyOriginal(original, 'Original copied!')}
              className="h-8 w-8 p-0"
            >
              {isOriginalCopied ? (
                <Check className="h-4 w-4 text-vscode-green" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <pre className="text-sm whitespace-pre-wrap text-txt-primary max-h-[400px] overflow-auto">
            {original}
          </pre>
        </Card>
        
        {/* Enhanced */}
        <Card className="vscode-card p-4 border-vscode-blue">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-vscode-blue flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Enhanced
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyEnhanced(enhanced, 'Enhanced version copied!')}
              className="h-8 w-8 p-0"
            >
              {isEnhancedCopied ? (
                <Check className="h-4 w-4 text-vscode-green" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <pre className="text-sm whitespace-pre-wrap text-txt-primary max-h-[400px] overflow-auto">
            {enhanced}
          </pre>
        </Card>
      </div>
      
      <div className="text-xs text-txt-muted">
        Character count: {original.length} → {enhanced.length} 
        ({enhanced.length > original.length ? '+' : ''}{enhanced.length - original.length})
      </div>
    </div>
  )
}
