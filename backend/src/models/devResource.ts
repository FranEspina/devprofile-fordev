import { z } from 'zod'
import { DevResourceSchema } from '../schemas/devResourceSchema'

export type DevResource = z.infer<typeof DevResourceSchema>;