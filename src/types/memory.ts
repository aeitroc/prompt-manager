export interface SuccessPattern {
  id: string
  pattern_name: string
  use_case: string
  implementation: string
  technologies: string[]
  benefits: string[]
  tradeoffs: string[]
  code_example?: string
}

export interface FailurePattern {
  id: string
  date: string
  problem: string
  symptoms: string[]
  root_cause: string
  solution: string
  technologies: string[]
  prevention: string
  diagnostic_commands?: string[]
}

export interface ProjectTemplate {
  id: string
  name: string
  category: string
  description: string
  tech_stack: Record<string, string[]>
  file_structure?: Record<string, any>
}

export interface MemoryPatternMatch {
  pattern: SuccessPattern | FailurePattern | ProjectTemplate
  type: 'success' | 'failure' | 'template'
  relevanceScore: number
  matchedKeywords: string[]
}

export type MemoryMatch = MemoryPatternMatch
