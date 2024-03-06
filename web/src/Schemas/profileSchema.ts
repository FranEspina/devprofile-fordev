import { z } from 'astro/zod'

export const ProfileSchema = z.object(
  {
    id: z.number(),
    userId: z.number(),
    network: z.string({ required_error: "Red social obligatoria" }).min(1, "Red social obligatoria"),
    username: z.string({ required_error: "Usuario obligatorio" }).min(1, "Usuario obligatorio"),
    url: z.string({ required_error: "Perfil público obligatorio" }).min(1, "Perfil público obligatorio").url("Url no válida"),
  }
)

export const ProfileCreateSchema = ProfileSchema.omit({
  id: true
})

export const ProfileDeleteSchema = ProfileSchema.omit({
  network: true,
  username: true,
  url: true,
})

export type Profile = z.infer<typeof ProfileSchema>
export type ProfileCreate = z.infer<typeof ProfileCreateSchema>
export type ProfileDelete = z.infer<typeof ProfileDeleteSchema>
