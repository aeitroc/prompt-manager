import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createPromptSchema } from '@/lib/validations/prompt'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)

    const where: any = {}

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            name: {
              in: tags
            }
          }
        }
      }
    }

    const prompts = await prisma.prompt.findMany({
      where,
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Transform the data to match our expected format
    const transformedPrompts = prompts.map((prompt: any) => ({
      ...prompt,
      tags: prompt.tags.map((tag: any) => tag.tag)
    }))

    return NextResponse.json(transformedPrompts)
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPromptSchema.parse(body)

    // Handle tags - create new ones if they don't exist
    if (validatedData.tags && validatedData.tags.length > 0) {
      const existingTags = await prisma.tag.findMany({
        where: {
          name: {
            in: validatedData.tags
          }
        }
      })

      const existingTagNames = existingTags.map((tag: any) => tag.name)
      const newTagNames = validatedData.tags.filter(name => !existingTagNames.includes(name))

      // Create new tags
      if (newTagNames.length > 0) {
        await prisma.tag.createMany({
          data: newTagNames.map((name: string) => ({ name }))
        })
      }
    }

    // Create the prompt
    const prompt = await prisma.prompt.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        description: validatedData.description,
        color: validatedData.color,
        categoryId: validatedData.categoryId,
        tags: validatedData.tags && validatedData.tags.length > 0 ? {
          create: validatedData.tags.map(tagName => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName }
              }
            }
          }))
        } : undefined
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    // Transform the response
    const transformedPrompt = {
      ...prompt,
      tags: prompt.tags.map((tag: any) => tag.tag)
    }

    return NextResponse.json(transformedPrompt, { status: 201 })
  } catch (error) {
    console.error('Error creating prompt:', error)
    return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 })
  }
}
