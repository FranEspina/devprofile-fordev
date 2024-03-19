import { z } from 'astro/zod'
import { DeleteSectionSchema } from './commonSchema'

const EducationBaseSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  institution: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  url: z.string().url({ message: 'url inválida' }).optional(),
  area: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  studyType: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  startDate: z.string({ required_error: 'Fecha desde obligatoria' }).min(1, 'Obligatorio'),
  endDate: z.string().nullable().optional(),
  score: z.string().nullable().optional(),
  courses: z.string().optional(),
})

const errValDateRange = {
  message: "La fecha fin debe ser mayor o igual que la fecha inicio",
  path: ['endDate']
}

export const EducationSchema = EducationBaseSchema
  .refine(p => (!p.endDate || (p.endDate && p.endDate > p.startDate)),
    errValDateRange)

export const EducationResumeSchema = EducationBaseSchema.extend(
  {
    courses: z.string().array().optional(),
  }
).refine(p => (!p.endDate || (p.endDate && p.endDate > p.startDate)),
  errValDateRange)

export const EducationCreateSchema = EducationBaseSchema.omit({
  id: true,
}).refine(p => (!p.endDate || (p.endDate && p.endDate > p.startDate)),
  errValDateRange)

export type Education = z.infer<typeof EducationSchema>
export type EducationCreate = z.infer<typeof EducationCreateSchema>
export type EducationDelete = z.infer<typeof DeleteSectionSchema>
export type EducationResume = z.infer<typeof EducationResumeSchema>
