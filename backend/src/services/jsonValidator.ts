
import { Validator, type Schema } from 'jsonschema'
import axios from 'axios'
import JsonRefs from 'json-refs'

export async function resumeJsonValidateAsync(jsonContent: string) {
  return resumeValidateAsync(JSON.parse(jsonContent))
}

export async function resumeValidateAsync(data: object) {
  const schemaUrl = 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json';
  const schemaResponse = await axios.get(schemaUrl);
  const schema = schemaResponse.data;
  const resolvedSchema = await JsonRefs.resolveRefs(schema);
  const validator = new Validator();
  const validation = validator.validate(data, resolvedSchema.resolved as Schema)
  if (validation.valid) {
    return {
      success: true,
      message: 'El archivo JSON es válido',
      error: null,
    }
  } else {
    return {
      success: false,
      message: 'El archivo JSON no es válido',
      error: validation.errors,
    }
  }
}
