import OpenAI from 'openai'
import type { AIModelConfig } from '@/types/ai'

export function createAIClient(config: AIModelConfig) {
  console.log('Creating AI client:', {
    provider: config.provider,
    model: config.model,
    baseURL: config.base_url,
  })

  try {
    if (config.provider === 'anthropic') {
      // Anthropic-compatible client - ensure baseURL ends with /v1
      const baseURL = config.base_url.endsWith('/v1') ? config.base_url : `${config.base_url}/v1`
      const client = new OpenAI({
        apiKey: config.api_key,
        baseURL: baseURL,
        defaultHeaders: {
          'anthropic-version': '2023-06-01',
        },
        dangerouslyAllowBrowser: true, // Enable in browser environment
      })
      console.log('Anthropic client created successfully with baseURL:', baseURL)
      return client
    } else {
      // OpenAI-compatible client
      const client = new OpenAI({
        apiKey: config.api_key,
        baseURL: config.base_url,
        dangerouslyAllowBrowser: true, // Enable in browser environment
      })
      console.log('OpenAI client created successfully')
      return client
    }
  } catch (error) {
    console.error('Failed to create AI client:', error)
    throw error
  }
}
