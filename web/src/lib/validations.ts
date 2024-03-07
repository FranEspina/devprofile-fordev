import { type Schema, z } from "astro/zod";

interface validateSchemaAsyncOutput<T> {
  success: boolean,
  errors: { [Key: string]: string },
  data: T | undefined
}

export async function validateSchemaAsync<T>(schema: Schema, data: unknown): Promise<validateSchemaAsyncOutput<T>> {

  const errors: { [key: string]: string } = {}
  let success: boolean = false

  try {
    const parsed = await schema.safeParseAsync(data)
    console.log(parsed)
    if (!parsed.success) {
      if (parsed.error instanceof z.ZodError) {
        parsed.error.errors.forEach((err) => {
          if (!errors[err.path[0]]) {
            errors[err.path[0]] = err.message;
          }
        });
      } else {
        errors['generic'] = parsed.error
      }
      return { success: false, errors, data: undefined }
    }

    return { success: true, errors: {}, data: parsed.data }
  }
  catch (error) {
    errors['generic'] = 'Error inesperado validando datos'
    return { success: false, errors, data: undefined }
  }

}

