import { z } from 'zod'

export const ReferenceSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  reference: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
})

export const ReferenceCreateSchema = ReferenceSchema.omit({
  id: true,
})

export const ReferenceResumeSchema = ReferenceSchema.omit({
  id: true,
  userId: true
})