import type { MemoryPatternMatch, SuccessPattern, FailurePattern, ProjectTemplate } from '@/types/memory'

interface MatchOptions {
  promptTitle: string
  promptContent: string
  category?: string
  tags?: string[]
  minRelevanceScore?: number
}

export function matchPatterns(
  patterns: {
    success: SuccessPattern[]
    failure: FailurePattern[]
    templates: ProjectTemplate[]
  },
  options: MatchOptions
): MemoryPatternMatch[] {
  const matches: MemoryPatternMatch[] = []
  const { promptTitle, promptContent, category, tags = [], minRelevanceScore = 0.3 } = options
  
  const searchText = `${promptTitle} ${promptContent} ${category} ${tags.join(' ')}`.toLowerCase()
  const keywords = extractKeywords(searchText)
  
  // Match success patterns
  patterns.success.forEach((pattern) => {
    const score = calculateRelevance(pattern, keywords, searchText)
    if (score >= minRelevanceScore) {
      matches.push({
        pattern,
        type: 'success',
        relevanceScore: score,
        matchedKeywords: getMatchedKeywords(pattern, keywords),
      })
    }
  })
  
  // Match failure patterns
  patterns.failure.forEach((pattern) => {
    const score = calculateRelevance(pattern, keywords, searchText)
    if (score >= minRelevanceScore) {
      matches.push({
        pattern,
        type: 'failure',
        relevanceScore: score,
        matchedKeywords: getMatchedKeywords(pattern, keywords),
      })
    }
  })
  
  // Match project templates
  patterns.templates.forEach((pattern) => {
    const score = calculateRelevance(pattern, keywords, searchText)
    if (score >= minRelevanceScore) {
      matches.push({
        pattern,
        type: 'template',
        relevanceScore: score,
        matchedKeywords: getMatchedKeywords(pattern, keywords),
      })
    }
  })
  
  // Sort by relevance score (descending)
  return matches.sort((a, b) => b.relevanceScore - a.relevanceScore)
}

function extractKeywords(text: string): string[] {
  // Remove common words and extract meaningful keywords
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'is', 'are', 'was', 'were']
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !stopWords.includes(w))
  return [...new Set(words)] // Unique keywords
}

function calculateRelevance(pattern: any, keywords: string[], searchText: string): number {
  let score = 0
  const patternText = JSON.stringify(pattern).toLowerCase()
  
  // Technology match (high weight)
  if (pattern.technologies) {
    const techMatches = pattern.technologies.filter((tech: string) =>
      searchText.includes(tech.toLowerCase())
    )
    score += techMatches.length * 0.3
  }
  
  // Keyword matches
  keywords.forEach((keyword) => {
    if (patternText.includes(keyword)) {
      score += 0.1
    }
  })
  
  // Category match
  if (pattern.category && searchText.includes(pattern.category.toLowerCase())) {
    score += 0.2
  }
  
  // Normalize score to 0-1 range
  return Math.min(score, 1)
}

function getMatchedKeywords(pattern: any, keywords: string[]): string[] {
  const patternText = JSON.stringify(pattern).toLowerCase()
  return keywords.filter(keyword => patternText.includes(keyword))
}
