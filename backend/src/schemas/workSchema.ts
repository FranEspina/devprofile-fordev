import { z } from 'zod'

export const WorkSchema = z.object({
  id: z.number({ required_error: 'Puestos. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Puestos. Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Puestos. Nombre obligatorio' }).min(1, 'Puestos. Nombre obligatorio'),
  location: z.string({ required_error: 'Puestos. Lugar obligatorio' }).min(1, 'Puestos. Lugar obligatorio'),
  description: z.string({ required_error: 'Puestos. Descripción obligatoria' }).min(1, 'Puestos. Descripción obligatoria'),
  position: z.string({ required_error: 'Puestos. Posición obligatoria' }).min(1, 'Puestos. Posición obligatoria'),
  url: z.string().url({ message: 'Puestos. Url inválida' }).nullable().optional().or(z.literal('')),
  startDate: z.string({ required_error: 'Puestos. Fecha desde obligatoria' }).min(1, 'Puestos. Obligatorio'),
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