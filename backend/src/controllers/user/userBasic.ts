import { UserSectionBaseController } from './base/UserSectionBaseController'
import { BasicCreateSchema, BasicDeleteSchema, BasicSchema } from '../../schemas/basicSchema'
import { Request } from 'express'

function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserBasicController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'basics',
      'datos básicos(s)',
      BasicCreateSchema,
      BasicSchema,
      BasicDeleteSchema,
      false,
      parseBody
    )
  }
}