'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import type { MemoryPatternMatch } from '@/types/memory'
import { CheckCircle2, Circle } from 'lucide-react'

interface MemoryPatternSelectorProps {
  matches: MemoryPatternMatch[]
  selectedPatterns: string[]
  onSelectPatterns: (patterns: string[]) => void
}

export function MemoryPatternSelector({
  matches,
  selectedPatterns,
  onSelectPatterns,
}: MemoryPatternSelectorProps) {
  const { copyToClipboard } = useCopyToClipboard()
  
  const togglePattern = (patternId: string) => {
    if (selectedPatterns.includes(patternId)) {
      onSelectPatterns(selectedPatterns.filter(id => id !== patternId))
    } else {
      onSelectPatterns([...selectedPatterns, patternId])
    }
  }
  
  const copyPattern = (e: React.MouseEvent, pattern: any) => {
    e.stopPropagation()
    let content = `Pattern: ${pattern.pattern_name || pattern.name || pattern.problem}\n\n`
    
    if (pattern.use_case) {
      content += `Use Case: ${pattern.use_case}\n\n`
    }
    if (pattern.implementation) {
      content += `Implementation: ${pattern.implementation}\n\n`
    }
    if (pattern.solution) {
      content += `Solution: ${pattern.solution}\n\n`
    }
    if (pattern.prevention) {
      content += `Prevention: ${pattern.prevention}\n\n`
    }
    if (pattern.technologies) {
      content += `Technologies: ${pattern.technologies.join(', ')}\n\n`
    }
    if (pattern.code_example) {
      content += `Code Example:\n${pattern.code_example}\n`
    }
    
    copyToClipboard(content, 'Pattern copied to clipboard!')
  }
  
  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-txt-muted">
        No memory patterns found. The AI will enhance your prompt without additional context.
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-txt-secondary">
        Select patterns to include in the enhancement context. Higher relevance scores indicate better matches.
      </p>
      
      {matches.map((match) => {
        const isSelected = selectedPatterns.includes(match.pattern.id)
        const pattern = match.pattern as any
        
        return (
          <Card
            key={match.pattern.id}
            className={`vscode-card p-4 cursor-pointer transition-all ${
              isSelected ? 'border-vscode-blue bg-bg-elevated' : ''
            }`}
            onClick={() => togglePattern(match.pattern.id)}
          >
            <div className="flex items-start gap-3">
              {isSelected ? (
                <CheckCircle2 className="h-5 w-5 text-vscode-blue mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-txt-muted mt-0.5 flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={match.type === 'success' ? 'default' : 'destructive'}>
                    {match.type}
                  </Badge>
                  <span className="text-xs text-txt-muted">
                    {(match.relevanceScore * 100).toFixed(0)}% relevant
                  </span>
                </div>
                
                <h4 className="font-semibold mb-1">
                  {pattern.pattern_name || pattern.name || pattern.problem}
                </h4>
                
                {pattern.use_case && (
                  <p className="text-sm text-txt-secondary mb-2">{pattern.use_case}</p>
                )}
                
                {pattern.technologies && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {pattern.technologies.slice(0, 3).map((tech: string) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {pattern.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{pattern.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                {match.matchedKeywords.length > 0 && (
                  <p className="text-xs text-txt-muted mb-2">
                    Matched: {match.matchedKeywords.join(', ')}
                  </p>
                )}
                
                <button
                  onClick={(e) => copyPattern(e, pattern)}
                  className="text-xs text-vscode-blue hover:text-vscode-blue-light mt-2"
                >
                  Copy pattern
                </button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
