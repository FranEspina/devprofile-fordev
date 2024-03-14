import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { ReferenceSchema, ReferenceCreateSchema } from '../../schemas/referenceSchema'


function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    name: req.body.name,
    reference: req.body.reference,
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
      parseBody
    )
  }
}
