import { NextRequest, NextResponse } from 'next/server'
import { loadAllPatterns } from '@/lib/memory/loader'
import { matchPatterns } from '@/lib/memory/matcher'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { promptTitle, promptContent, category, tags } = body
    
    const patterns = loadAllPatterns()
    const matches = matchPatterns(patterns, {
      promptTitle,
      promptContent,
      category,
      tags,
      minRelevanceScore: 0.2, // Lower threshold for more results
    })
    
    // Return top 10 matches
    return NextResponse.json({ matches: matches.slice(0, 10) })
  } catch (error) {
    console.error('Error searching memory patterns:', error)
    return NextResponse.json({ error: 'Failed to search patterns' }, { status: 500 })
  }
}
