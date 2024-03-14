import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { LocationSchema, LocationCreateSchema } from '../../schemas/locationSchema'


function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    address: req.body.address,
    postalCode: req.body.postalCode,
    city: req.body.city,
    countryCode: req.body.countryCode,
    region: req.body.region,
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
      parseBody
    )
  }
}
