import { z } from 'zod'

export const ProfileSchema = z.object({
  id: z.number({ required_error: 'Perfiles. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Perfiles. Identificador del usuario obligatorio' }),
  network: z.string({ required_error: 'Perfiles. Red social obligatoria' }).min(1, 'Perfiles. Red social obligatoria'),
  username: z.string({ required_error: 'Perfiles. Usuario obligatorio' }).min(1, 'Perfiles. Usuario obligatorio'),
  url: z.string({ required_error: 'Perfiles. Url inválida' }).url({ message: 'Perfiles. Url inválida' })
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