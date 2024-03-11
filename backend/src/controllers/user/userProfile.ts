import { Request } from 'express'
import { ProfileSchema, ProfileCreateSchema, ProfileDeleteSchema } from '../../schemas/profileSchema'
import { UserSectionController } from './base/UserSectionBaseController'

function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    network: req.body.network,
    username: req.body.username,
    url: req.body.url,
  }
  return formatBody
}

export class UserProfileController extends UserSectionController<{ id: number, userId: string }> {
  constructor() {
    super(
      'profiles',
      'perfil(es)',
      ProfileCreateSchema,
      ProfileSchema,
      ProfileDeleteSchema,
      parseBody
    )
  }
}


