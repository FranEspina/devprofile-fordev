import { z } from 'zod'

export const EducationSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  institution: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  url: z.string().url({ message: 'url inválida' }).optional(),
  area: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  studyType: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  startDate: z.date({ required_error: 'Fecha desde obligatoria' }),
  endDate: z.date().optional(),
  score: z.string().optional(),
  courses: z.string().optional(),
})

export const EducationCreateSchema = EducationSchema.omit({
  id: true,
})

export const EducationResumeSchema = EducationSchema.omit({
  id: true,
  userId: true
})