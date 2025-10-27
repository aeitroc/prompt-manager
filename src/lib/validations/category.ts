import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  icon: z.string().optional().nullable(),
})

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
