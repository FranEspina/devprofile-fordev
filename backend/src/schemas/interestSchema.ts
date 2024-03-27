import { z } from 'zod'

export const InterestSchema = z.object({
  id: z.number({ required_error: 'Intereses. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Intereses. Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Intereses. Nombre obligatorio' }).min(1, 'Intereses. Nombre obligatorio'),
  keywords: z.string({ required_error: 'Intereses. Palabra(s) clave obligatorio' }).min(1, 'Intereses. Palabra(s) clave obligatorio'),
})

export const InterestCreateSchema = InterestSchema.omit({
  id: true,
})

export const InterestResumeSchema = InterestSchema.omit({
  id: true,
  userId: true
})