import fs from 'fs'
import type { AIConfig } from '@/types/ai'

const CONFIG_PATH = '/Users/besi/.factory/config.json'

export function loadAIConfig(): AIConfig {
  try {
    const configData = fs.readFileSync(CONFIG_PATH, 'utf-8')
    return JSON.parse(configData) as AIConfig
  } catch (error) {
    console.error('Failed to load AI config:', error)
    throw new Error('AI configuration not found')
  }
}

export function getAvailableModels(): AIConfig['custom_models'] {
  const config = loadAIConfig()
  return config.custom_models
}

export function getModelByIndex(index: number) {
  const models = getAvailableModels()
  if (index < 0 || index >= models.length) {
    throw new Error('Invalid model index')
  }
  return models[index]
}

export function getDefaultModel() {
  const models = getAvailableModels()
  // Prefer Claude.Code or first Anthropic model
  const claudeCode = models.find(m => m.model_display_name === 'Claude.Code')
  const firstAnthropic = models.find(m => m.provider === 'anthropic')
  return claudeCode || firstAnthropic || models[0]
}
