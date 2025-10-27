import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateCategorySchema } from '@/lib/validations/category'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  
  try {
    const body = await request.json()
    const validatedData = updateCategorySchema.parse({ ...body, id: params.id })

    const category = await prisma.category.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  
  try {
    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
