import { Request } from 'express'
import { ProfileSchema, ProfileCreateSchema, ProfileDeleteSchema } from '../../schemas/profileSchema'
import { UserSectionBaseController } from './base/UserSectionBaseController'

function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserProfileController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'profiles',
      'perfil(es)',
      ProfileCreateSchema,
      ProfileSchema,
      ProfileDeleteSchema,
      true,
      parseBody
    )
  }
}


