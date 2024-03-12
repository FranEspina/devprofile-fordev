import { z } from 'astro/zod'

export const SectionSchema = z.object(
  {
    id: z.number().min(1),
    userId: z.number().min(1),
    sectionName: z.number().min(1),
    sectionId: z.number().min(1),
    isPublic: z.boolean(),
  }
)

export type Section = z.infer<typeof SectionSchema>
