import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { ReferenceSchema, ReferenceCreateSchema } from '../../schemas/referenceSchema'


function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserReferenceController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'user_references',
      'referencias',
      ReferenceCreateSchema,
      ReferenceSchema,
      DeleteSectionSchema,
      true,
      parseBody
    )
  }
}
