import { z } from 'astro/zod'
export function deleteSchema(schema: z.ZodObject<any>) {
  const omited: { [Key: string]: true } = {}
  Object.keys(schema.shape).forEach(p => {
    if (p !== 'id' && p !== 'userId') {
      omited[p] = true
    }
  })
  return schema.omit(omited)
}

export function createSchema(schema: z.ZodObject<any>) {
  const omited: { [Key: string]: true } = {}
  Object.keys(schema.shape).forEach(p => {
    if (p === 'id') {
      omited[p] = true
    }
  })
  return schema.omit(omited)
}