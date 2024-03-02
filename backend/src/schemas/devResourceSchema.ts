import { z } from 'zod'

export const DevResourceSchema = z.object({
  id: z.number({ required_error: 'Identificador del recurso obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  title: z.string({ required_error: 'Título del recurso obligatorio' }).min(1),
  description: z.string({ required_error: 'Descripción del recurso obligatorio' }).min(1),
  type: z.enum(['markdown', 'imagen', 'web', 'archivo']),
  url: z.string().url({ message: 'url inválida' }).optional(),
  keywords: z.string().optional()
})

export const DevResourceCreateSchema = DevResourceSchema.omit({
  id: true,
})

export const DevResourceDeleteSchema = DevResourceSchema.omit({
  title: true,
  description: true,
  type: true,
  url: true,
  keywords: true
})


