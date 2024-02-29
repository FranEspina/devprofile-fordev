import { z } from 'zod'
import { DevResourceSchema, DevResourceCreateSchema, DevResourceDeleteSchema } from '../schemas/devResourceSchema'

export type DevResource = z.infer<typeof DevResourceSchema>;
export type DevResourceCreate = z.infer<typeof DevResourceCreateSchema>
export type DevResourceDelete = z.infer<typeof DevResourceDeleteSchema>
