import { Schema } from 'zod'

export async function validateSchemaAsync<TSchema extends Schema, TOutModel>(schema: TSchema, userToParse: unknown): Promise<{ success: boolean, user?: TOutModel, errors?: string[] }> {

  try {
    const result = await schema.safeParseAsync(userToParse)
    if (result.success) {
      const userParsed: TOutModel = result.data
      return { success: true, user: userParsed }
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