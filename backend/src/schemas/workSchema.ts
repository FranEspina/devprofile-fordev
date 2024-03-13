import { z } from 'zod'

export const WorkSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  title: z.string({ required_error: 'Título obligatorio' }).min(1, 'Título obligatorio'),
  position: z.string({ required_error: 'Posición obligatoria' }).min(1, 'Posición obligatoria'),
  description: z.string({ required_error: 'Descripción obligatoria' }).min(1, 'Descripción obligatoria'),
  startDate: z.date({ required_error: 'Fecha desde obligatoria' }),
  endDate: z.date().optional()
})

export const WorkCreateSchema = WorkSchema.omit({
  id: true,
})

export const WorkDeleteSchema = WorkSchema.omit({
  title: true,
  position: true,
  description: true,
  startDate: true,
  endDate: true,
})

export const WorkResumeSchema = WorkSchema.omit({
  id: true,
  userId: true
})