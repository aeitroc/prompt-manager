import { NextRequest, NextResponse } from 'next/server'
import { enhancePrompt } from '@/lib/ai/enhance-prompt'
import { loadAllPatterns } from '@/lib/memory/loader'
import { matchPatterns } from '@/lib/memory/matcher'
import type { EnhancePromptRequest } from '@/types/ai'
import type { MemoryMatch } from '@/types/memory'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EnhancePromptRequest & {
      includeMemory?: boolean
      promptTitle?: string
    }
    
    console.log('Enhancement request:', {
      hasPrompt: !!body.originalPrompt,
      includeMemory: body.includeMemory,
      modelId: body.modelId,
    })
    
    let memoryMatches: MemoryMatch[] = []
    
    // Search memory patterns if requested
    if (body.includeMemory && body.promptTitle) {
      try {
        const patterns = loadAllPatterns()
        console.log('Loaded patterns:', {
          success: patterns.success.length,
          failure: patterns.failure.length,
          templates: patterns.templates.length,
        })
        memoryMatches = matchPatterns(patterns, {
          promptTitle: body.promptTitle,
          promptContent: body.originalPrompt,
          category: body.category,
          tags: body.tags,
        })
        console.log('Found memory matches:', memoryMatches.length)
      } catch (memError) {
        console.error('Memory loading error (non-fatal):', memError)
        // Continue without memory patterns
      }
    }
    
    // Filter to selected patterns if specified
    if (body.memoryPatternIds && body.memoryPatternIds.length > 0) {
      memoryMatches = memoryMatches.filter(m =>
        body.memoryPatternIds!.includes(m.pattern.id)
      )
    }
    
    console.log('Calling enhancePrompt with', memoryMatches.length, 'patterns')
    const result = await enhancePrompt(body, memoryMatches.slice(0, 5)) // Top 5 patterns
    console.log('Enhancement successful')
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Enhancement API error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { 
        error: 'Failed to enhance prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
