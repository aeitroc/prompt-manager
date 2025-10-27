'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PromptComparison } from './prompt-comparison'
import { MemoryPatternSelector } from './memory-pattern-selector'
import { AIProviderSelector } from '@/components/ai/ai-provider-selector'
import { Loader2, Sparkles, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { MemoryPatternMatch } from '@/types/memory'

interface PromptEnhanceDialogProps {
  isOpen: boolean
  onClose: () => void
  promptTitle: string
  originalContent: string
  category?: string
  tags?: string[]
  onAcceptEnhancement: (enhancedContent: string, metadata: EnhancementMetadata) => void
}

interface EnhancementMetadata {
  model: string
  memoryPatternsUsed: string[]
}

export function PromptEnhanceDialog({
  isOpen,
  onClose,
  promptTitle,
  originalContent,
  category,
  tags = [],
  onAcceptEnhancement,
}: PromptEnhanceDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [enhancedContent, setEnhancedContent] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<EnhancementMetadata | null>(null)
  const [memoryMatches, setMemoryMatches] = useState<MemoryPatternMatch[]>([])
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<number | undefined>(undefined) // Use undefined to let backend choose default
  const [includeMemory, setIncludeMemory] = useState(true)
  
  const handleSearchMemory = async () => {
    try {
      const response = await fetch('/api/memory/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptTitle,
          promptContent: originalContent,
          category,
          tags,
        }),
      })
      
      const data = await response.json()
      setMemoryMatches(data.matches || [])
      
      // Auto-select top 3 matches
      const topMatches = data.matches?.slice(0, 3).map((m: MemoryPatternMatch) => m.pattern.id) || []
      setSelectedPatterns(topMatches)
    } catch (error) {
      console.error('Failed to search memory:', error)
      toast.error('Failed to search memory patterns')
    }
  }
  
  const handleEnhance = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/prompts/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPrompt: originalContent,
          category,
          tags,
          modelId: selectedModel, // undefined will use default (Claude.Code)
          includeMemory,
          promptTitle,
          memoryPatternIds: includeMemory ? selectedPatterns : [],
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Enhancement failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData.error,
          details: errorData.details,
        })
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setEnhancedContent(data.enhancedPrompt)
      setMetadata({
        model: data.model,
        memoryPatternsUsed: data.memoryPatternsUsed,
      })
      
      toast.success('Prompt enhanced successfully!')
    } catch (error) {
      console.error('Enhancement failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to enhance prompt'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleAccept = () => {
    if (enhancedContent && metadata) {
      onAcceptEnhancement(enhancedContent, metadata)
      onClose()
    }
  }
  
  const handleReset = () => {
    setEnhancedContent(null)
    setMetadata(null)
    setSelectedPatterns([])
  }
  
  // Auto-search memory when dialog opens
  useEffect(() => {
    if (isOpen && !memoryMatches.length) {
      handleSearchMemory()
    }
  }, [isOpen])
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-vscode-blue" />
            Enhance Prompt with AI
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="enhance" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enhance">Enhance</TabsTrigger>
            <TabsTrigger value="memory" onClick={handleSearchMemory}>
              Memory Patterns ({memoryMatches.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="enhance" className="flex-1 overflow-auto space-y-4">
            <div className="space-y-4">
              <AIProviderSelector
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
              />
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeMemory"
                  checked={includeMemory}
                  onChange={(e) => setIncludeMemory(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="includeMemory" className="text-sm">
                  Include memory patterns in enhancement
                </label>
              </div>
              
              {!enhancedContent ? (
                <div className="space-y-4">
                  <div className="vscode-card p-4">
                    <h3 className="font-semibold mb-2">Original Prompt</h3>
                    <pre className="text-sm whitespace-pre-wrap">{originalContent}</pre>
                  </div>
                  
                  <Button
                    onClick={handleEnhance}
                    disabled={isLoading || !originalContent.trim()}
                    className="vscode-button-primary w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Enhance Prompt
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <PromptComparison
                    original={originalContent}
                    enhanced={enhancedContent}
                    model={metadata?.model}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAccept}
                      className="vscode-button-primary flex-1"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept Enhancement
                    </Button>
                    <Button
                      onClick={handleReset}
                      className="vscode-button-secondary"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="memory" className="flex-1 overflow-auto">
            <MemoryPatternSelector
              matches={memoryMatches}
              selectedPatterns={selectedPatterns}
              onSelectPatterns={setSelectedPatterns}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
