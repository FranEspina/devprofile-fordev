import { z } from 'zod'

export const SectionSchema = z.object(
  {
    id: z.number().min(1),
    userId: z.number().min(1),
    sectionName: z.string().min(1),
    sectionId: z.number().min(1),
    isPublic: z.boolean(),
  }
)

export const CreateSectionSchema = SectionSchema.omit({
  id: true,
})

export const DeleteSectionSchema = SectionSchema.omit({
  sectionName: true,
  sectionId: true,
  isPublic: true,
})

export type Section = z.infer<typeof SectionSchema>
export type CreateSection = z.infer<typeof CreateSectionSchema>
export type DeleteSection = z.infer<typeof DeleteSectionSchema>