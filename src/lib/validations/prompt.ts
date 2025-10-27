import { z } from 'zod'

export const createPromptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  description: z.string().optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
})

export const updatePromptSchema = createPromptSchema.partial().extend({
  id: z.string(),
})

export type CreatePromptInput = z.infer<typeof createPromptSchema>
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>
