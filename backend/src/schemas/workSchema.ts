import { z } from 'zod'

export const WorkSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Nombre obligatorio' }).min(1, 'Nombre obligatorio'),
  location: z.string({ required_error: 'Lugar obligatorio' }).min(1, 'Lugar obligatorio'),
  description: z.string({ required_error: 'Descripción obligatoria' }).min(1, 'Descripción obligatoria'),
  position: z.string({ required_error: 'Posición obligatoria' }).min(1, 'Posición obligatoria'),
  url: z.string().url({ message: 'url inválida' }).nullable().optional().or(z.literal('')),
  startDate: z.string({ required_error: 'Fecha desde obligatoria' }).min(1, 'Obligatorio'),
  endDate: z.string().nullable().optional(),
  summary: z.string().optional(),
  highlights: z.string().optional(),
})

export const WorkCreateSchema = WorkSchema.omit({
  id: true,
})

export const WorkDeleteSchema = WorkSchema.omit({
  name: true,
  location: true,
  description: true,
  position: true,
  url: true,
  startDate: true,
  endDate: true,
  summary: true,
  highlights: true,
})

export const WorkResumeSchema = WorkSchema.omit({
  id: true,
  userId: true
})