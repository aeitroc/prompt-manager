import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updatePromptSchema } from '@/lib/validations/prompt'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Transform the response
    const transformedPrompt = {
      ...prompt,
      tags: prompt.tags.map((tag: any) => tag.tag)
    }

    return NextResponse.json(transformedPrompt)
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return NextResponse.json({ error: 'Failed to fetch prompt' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const body = await request.json()
    const validatedData = updatePromptSchema.parse({ ...body, id: params.id })

    // Delete existing tags
    await prisma.promptTag.deleteMany({
      where: { promptId: params.id }
    })

    // Update the prompt
    const prompt = await prisma.prompt.update({
      where: { id: params.id },
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

    return NextResponse.json(transformedPrompt)
  } catch (error) {
    console.error('Error updating prompt:', error)
    return NextResponse.json({ error: 'Failed to update prompt' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    await prisma.prompt.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return NextResponse.json({ error: 'Failed to delete prompt' }, { status: 500 })
  }
}
