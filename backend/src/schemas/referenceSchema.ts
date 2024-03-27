import { z } from 'zod'

export const ReferenceSchema = z.object({
  id: z.number({ required_error: 'Referencias. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Referencias. Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Referencias. Nombre obligatorio' }).min(1, 'Referencias. Nombre obligatorio'),
  reference: z.string({ required_error: 'Referencias. Texto obligatorio' }).min(1, 'Referencias. Texto obligatorio'),
})

export const ReferenceCreateSchema = ReferenceSchema.omit({
  id: true,
})

export const ReferenceResumeSchema = ReferenceSchema.omit({
  id: true,
  userId: true
})