import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { LanguageSchema, LanguageCreateSchema } from '../../schemas/languageSchema'


function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    language: req.body.language,
    fluency: req.body.fluency,
  }
  return formatBody
}

export class UserLanguageController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'languages',
      'idiomas',
      LanguageCreateSchema,
      LanguageSchema,
      DeleteSectionSchema,
      parseBody
    )
  }
}
