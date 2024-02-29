import { z } from 'zod'
import { DevResourceSchema, DevResourceCreateSchema } from '../schemas/devResourceSchema'

export type DevResource = z.infer<typeof DevResourceSchema>;
export type DevResourceCreate = z.infer<typeof DevResourceCreateSchema>