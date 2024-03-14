import { z } from 'zod'

export const LocationSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  address: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  postalCode: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  city: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  countryCode: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  region: z.string().optional(),
})

export const LocationCreateSchema = LocationSchema.omit({
  id: true,
})

export const LocationResumeSchema = LocationSchema.omit({
  id: true,
  userId: true
})