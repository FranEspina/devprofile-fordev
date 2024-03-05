import { z } from 'zod'
import { DevResourceSchema, DevResourceCreateSchema, DevResourceDeleteSchema } from '../schemas/devResourceSchema'
import { ProfileSchema, ProfileCreateSchema, ProfileDeleteSchema } from '../schemas/profileSchema'

export type DevResource = z.infer<typeof DevResourceSchema>;
export type DevResourceCreate = z.infer<typeof DevResourceCreateSchema>
export type DevResourceDelete = z.infer<typeof DevResourceDeleteSchema>

export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileCreate = z.infer<typeof ProfileCreateSchema>
export type ProfileDelete = z.infer<typeof ProfileDeleteSchema>
