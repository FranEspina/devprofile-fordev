import { z } from 'astro/zod'
import { deleteSchema, createSchema } from '@/lib/schemas'
export const SectionSchema = z.object(
  {
    id: z.number().min(1),
    userId: z.number().min(1),
    sectionName: z.string().min(1),
    sectionId: z.number().min(1),
    isPublic: z.boolean(),
  }
)

export const DeleteSectionSchema = deleteSchema(SectionSchema)
export const CreateSectionSchema = createSchema(SectionSchema)

export type Section = z.infer<typeof SectionSchema>
export type DeleteSection = z.infer<typeof DeleteSectionSchema>

export type SectionData = {
  id: number,
  userId: number,
  sectionName: string,
  sectionFullName: string,
  sectionId: number,
  sectionDesc: string,
  isPublic: boolean
} 