import { z } from 'zod'

export const DevResourceSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['markdown', 'imagen', 'web', 'archivo']),
  url: z.string().url(),
  keywords: z.string()
})