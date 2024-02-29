import { Schema } from 'zod'

export async function validateSchemaAsync<TSchema extends Schema, TOutModel>(schema: TSchema, dataToParse: unknown): Promise<{ success: boolean, data?: TOutModel, errors?: string[] }> {

  try {
    const result = await schema.safeParseAsync(dataToParse)
    if (result.success) {
      const parsed: TOutModel = result.data
      return { success: true, data: parsed }
    }
    else {
      const errors = result.error.errors.map(e => e.message)
      return { success: true, errors: errors }
    }
  }
  catch (error) {
    console.log(error)
    return { success: false, errors: ['Error inesperado validando datos'] }
  }
}