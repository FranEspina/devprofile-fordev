import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { PublicationSchema, PublicationCreateSchema } from '../../schemas/publicationSchema'


function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserPublicationController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'publications',
      'publicaciones',
      PublicationCreateSchema,
      PublicationSchema,
      DeleteSectionSchema,
      true,
      parseBody
    )
  }
}
