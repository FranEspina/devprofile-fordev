import { z } from 'zod'
import { DevResourceSchema, DevResourceCreateSchema, DevResourceDeleteSchema } from '../schemas/devResourceSchema'
import { ProfileSchema, ProfileCreateSchema, ProfileDeleteSchema } from '../schemas/profileSchema'
import { WorkSchema, WorkCreateSchema, WorkDeleteSchema } from '../schemas/workSchema'

export type DevResource = z.infer<typeof DevResourceSchema>;
export type DevResourceCreate = z.infer<typeof DevResourceCreateSchema>
export type DevResourceDelete = z.infer<typeof DevResourceDeleteSchema>

export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileCreate = z.infer<typeof ProfileCreateSchema>
export type ProfileDelete = z.infer<typeof ProfileDeleteSchema>

export type Work = z.infer<typeof WorkSchema>;
export type WorkCreate = z.infer<typeof WorkCreateSchema>
export type WorkDelete = z.infer<typeof WorkDeleteSchema>

export type UserDeleteSection = {
  tablename: string,
  id: number,
  userId: number
}