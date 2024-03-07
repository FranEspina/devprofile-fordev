import { type Schema, z } from "astro/zod";


export async function validateSchemaAsync(schema: Schema, data: unknown) {

  const errors: { [key: string]: string } = {}
  let success: boolean = false

  try {
    const parsed = await schema.safeParseAsync(data)
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
      return { success: false, errors }
    }

    return { success: true, errors: {} }
  }
  catch (error) {
    errors['generic'] = 'Error inesperado validando datos'
    return { success: false, errors }
  }

}

