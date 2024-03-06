import { z } from 'astro/zod'

export const UserWorkSchema = z.object(
  {
    id: z.number().positive().min(1),
    userId: z.number().positive().min(1),
    title: z.string(),
    description: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    highlights: z.array(z.string())
  }
)

export type UserWork = z.infer<typeof UserWorkSchema>
