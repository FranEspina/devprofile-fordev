import { z } from 'zod'

export const EducationSchema = z.object({
  id: z.number({ required_error: 'Estudios. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Estudios. Identificador del usuario obligatorio' }),
  institution: z.string({ required_error: 'Estudios. Institución obligatoria' }).min(1, 'Estudios. Institución obligatoria'),
  url: z.string().url({ message: 'Estudios. Url inválida' }).nullable().optional().or(z.literal('')),
  area: z.string({ required_error: 'Estudios. Área obligatoria' }).min(1, 'Estudios. Área obligatorio'),
  studyType: z.string({ required_error: 'Estudios. Tipo estudio obligatorio' }).min(1, 'Estudios. Tipo estudio obligatorio'),
  startDate: z.string({ required_error: 'Estudios. Fecha desde obligatoria' }).min(1, 'Estudios. Obligatorio'),
  endDate: z.string().nullable().optional(),
  score: z.string().nullable().optional(),
  courses: z.string().optional(),
})

export const EducationCreateSchema = EducationSchema.omit({
  id: true,
})

export const EducationResumeSchema = EducationSchema.omit({
  id: true,
  userId: true
})