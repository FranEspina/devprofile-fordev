import { z } from 'zod'

export const ProfileSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  network: z.string({ required_error: 'Red social obligatoria' }).min(1, 'Red social obligatoria'),
  username: z.string({ required_error: 'Usuario obligatorio' }).min(1, 'Usuario obligatorio'),
  url: z.string({ required_error: 'Url inválida' }).url({ message: 'url inválida' })
})

export const ProfileCreateSchema = ProfileSchema.omit({
  id: true,
})

export const ProfileDeleteSchema = ProfileSchema.omit({
  network: true,
  username: true,
  url: true,
})

export const ProfileResumeSchema = ProfileSchema.omit({
  id: true,
  userId: true
})