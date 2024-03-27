import { z } from 'zod'

export const PublicationSchema = z.object({
  id: z.number({ required_error: 'Publicaciones. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Publicaciones. Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Publicaciones. Obligatorio' }).min(1, 'Publicaciones. Obligatorio'),
  publisher: z.string({ required_error: 'Publicaciones. Editorial obligatorio' }).min(1, 'Publicaciones. Editorial Obligatoria'),
  releaseDate: z.string({ required_error: 'Publicaciones. Fecha obligatoria' }).min(1, 'Publicaciones. Fecha obligatoria'),
  url: z.string().url({ message: 'Publicaciones. Url inválida' }).nullable().optional().or(z.literal('')),
  summary: z.string({ required_error: 'Publicaciones. Resumen obligatorio' }).min(1, 'Publicaciones. Resumen obligatorio'),
})

export const PublicationCreateSchema = PublicationSchema.omit({
  id: true,
})

export const PublicationResumeSchema = PublicationSchema.omit({
  id: true,
  userId: true
})


