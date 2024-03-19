import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { VolunteerSchema, VolunteerCreateSchema } from '../../schemas/volunteerSchema'


function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserVolunteerController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'volunteers',
      'voluntariado',
      VolunteerCreateSchema,
      VolunteerSchema,
      DeleteSectionSchema,
      true,
      parseBody
    )
  }
}
