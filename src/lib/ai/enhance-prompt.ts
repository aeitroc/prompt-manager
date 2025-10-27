import { createAIClient } from './client'
import { getModelByIndex, getDefaultModel } from './config-loader'
import type { EnhancePromptRequest, EnhancePromptResponse } from '@/types/ai'
import type { MemoryPatternMatch } from '@/types/memory'

export async function enhancePrompt(
  request: EnhancePromptRequest,
  memoryMatches: MemoryPatternMatch[] = []
): Promise<EnhancePromptResponse> {
  console.log('enhancePrompt called with modelId:', request.modelId)
  
  let modelConfig
  try {
    modelConfig = request.modelId !== undefined
      ? getModelByIndex(request.modelId)
      : getDefaultModel()
    console.log('Using model:', modelConfig.model_display_name)
  } catch (error) {
    console.error('Failed to load model config:', error)
    throw new Error(`Failed to load AI model configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  let client
  try {
    client = createAIClient(modelConfig)
  } catch (error) {
    console.error('Failed to create AI client:', error)
    throw new Error(`Failed to create AI client: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  // Build context from memory patterns
  const memoryContext = buildMemoryContext(memoryMatches)
  
  // Build enhancement prompt
  const systemPrompt = buildSystemPrompt(memoryContext)
  const userPrompt = buildUserPrompt(request)
  
  console.log('Sending request to AI model:', modelConfig.model)
  console.log('Request payload preview:', {
    model: modelConfig.model,
    messageCount: 2, // system + user
    temperature: 0.7,
    max_tokens: 2000,
  })
  
  try {
    const response = await client.chat.completions.create({
      model: modelConfig.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })
    
    console.log('AI response received, choices count:', response.choices?.length || 0)
    console.log('Response metadata:', {
      usage: response.usage,
      id: response.id,
      created: response.created,
    })
    
    const enhancedPrompt = response.choices[0]?.message?.content || request.originalPrompt
    console.log('Enhanced prompt length:', enhancedPrompt.length)
    
    return {
      enhancedPrompt: enhancedPrompt.trim(),
      model: modelConfig.model_display_name,
      memoryPatternsUsed: memoryMatches.map(m => m.pattern.id),
      suggestions: [], // Could extract suggestions from response
    }
  } catch (error) {
    console.error('AI enhancement failed:', error)
    console.error('Model config:', { model: modelConfig.model, baseURL: modelConfig.base_url })
    throw new Error(`AI API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function buildMemoryContext(matches: MemoryPatternMatch[]): string {
  if (matches.length === 0) return ''
  
  let context = '\n\n## RELEVANT MEMORY PATTERNS\n\n'
  context += 'The following patterns from the knowledge base are relevant to this prompt:\n\n'
  
  matches.forEach((match, index) => {
    context += `### Pattern ${index + 1}: ${match.pattern.id}\n`
    context += `Type: ${match.type}\n`
    context += `Relevance: ${(match.relevanceScore * 100).toFixed(0)}%\n`
    
    if (match.type === 'success') {
      const p = match.pattern as any
      context += `Pattern: ${p.pattern_name}\n`
      context += `Use Case: ${p.use_case}\n`
      context += `Implementation: ${p.implementation}\n`
      if (p.code_example) {
        context += `Code Example:\n${p.code_example}\n`
      }
    } else if (match.type === 'failure') {
      const p = match.pattern as any
      context += `Problem: ${p.problem}\n`
      context += `Solution: ${p.solution}\n`
      context += `Prevention: ${p.prevention}\n`
    } else {
      const p = match.pattern as any
      context += `Template: ${p.name}\n`
      context += `Description: ${p.description}\n`
    }
    
    context += `\n`
  })
  
  return context
}

function buildSystemPrompt(memoryContext: string): string {
  return `You are an expert AI prompt engineer. Your task is to enhance and improve prompts for AI systems.

Your goals:
1. Make prompts more clear, specific, and actionable
2. Add relevant context and constraints
3. Improve structure and formatting
4. Incorporate best practices from memory patterns (if provided)
5. Ensure the enhanced prompt will produce better AI responses

Guidelines:
- Keep the original intent and core request
- Add clarity without over-complicating
- Use markdown formatting for structure
- Add examples if helpful
- Include relevant constraints or requirements
- Consider the category and tags when enhancing
${memoryContext}

Return ONLY the enhanced prompt, no explanations or metadata.`
}

function buildUserPrompt(request: EnhancePromptRequest): string {
  let prompt = `Please enhance this prompt:\n\n${request.originalPrompt}`
  
  if (request.category) {
    prompt += `\n\nCategory: ${request.category}`
  }
  
  if (request.tags && request.tags.length > 0) {
    prompt += `\nTags: ${request.tags.join(', ')}`
  }
  
  return prompt
}
