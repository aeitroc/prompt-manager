import { NextResponse } from 'next/server'
import { getAvailableModels } from '@/lib/ai/config-loader'

export async function GET() {
  try {
    const models = getAvailableModels()
    return NextResponse.json({ models })
  } catch (error) {
    console.error('Failed to load AI models:', error)
    return NextResponse.json({ error: 'Failed to load models' }, { status: 500 })
  }
}
