export interface Prompt {
  id: string
  title: string
  content: string
  description: string | null
  color: string
  categoryId: string | null
  isEnhanced: boolean
  originalContent: string | null
  enhancedBy: string | null
  memoryPatternsUsed: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string | null
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
  _count?: {
    prompts: number
  }
}

export interface Tag {
  id: string
  name: string
  createdAt: Date
}
