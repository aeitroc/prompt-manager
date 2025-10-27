'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAIModels } from '@/hooks/use-ai-models'
import { Loader2 } from 'lucide-react'

interface AIProviderSelectorProps {
  selectedModel: number | undefined
  onSelectModel: (index: number | undefined) => void
}

export function AIProviderSelector({ selectedModel, onSelectModel }: AIProviderSelectorProps) {
  const { models, isLoading } = useAIModels()
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-txt-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading AI models...
      </div>
    )
  }
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">AI Model</label>
      <Select 
        value={selectedModel !== undefined ? selectedModel.toString() : 'default'} 
        onValueChange={(val) => onSelectModel(val === 'default' ? undefined : parseInt(val))}
      >
        <SelectTrigger className="vscode-input">
          <SelectValue placeholder="Select AI model" />
        </SelectTrigger>
        <SelectContent className="bg-bg-secondary border-bdr-default">
          <SelectItem value="default">
            <span className="font-semibold">Default (Claude.Code)</span>
          </SelectItem>
          {models.map((model, index) => (
            <SelectItem key={index} value={index.toString()}>
              {model.model_display_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedModel !== undefined && models[selectedModel] && (
        <p className="text-xs text-txt-muted">
          Model: {models[selectedModel].model}
        </p>
      )}
      {selectedModel === undefined && (
        <p className="text-xs text-txt-muted">
          Using default: Claude.Code (claude-sonnet-4-5-20250929)
        </p>
      )}
    </div>
  )
}
