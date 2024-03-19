import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { LocationSchema, LocationCreateSchema } from '../../schemas/locationSchema'


function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserLocationController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'locations',
      'direccion(es)',
      LocationCreateSchema,
      LocationSchema,
      DeleteSectionSchema,
      true,
      parseBody
    )
  }
}
