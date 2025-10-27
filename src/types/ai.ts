export interface AIModelConfig {
  model_display_name: string
  model: string
  base_url: string
  api_key: string
  provider: 'openai' | 'anthropic'
}

export interface AIConfig {
  custom_models: AIModelConfig[]
}

export interface EnhancePromptRequest {
  originalPrompt: string
  category?: string
  tags?: string[]
  memoryPatternIds?: string[]
  modelId?: number // Index in custom_models array
}

export interface EnhancePromptResponse {
  enhancedPrompt: string
  model: string
  memoryPatternsUsed: string[]
  suggestions?: string[]
}
