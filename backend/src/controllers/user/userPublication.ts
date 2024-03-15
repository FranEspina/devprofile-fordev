import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { PublicationSchema, PublicationCreateSchema } from '../../schemas/publicationSchema'


function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    name: req.body.name,
    publisher: req.body.publisher,
    releaseDate: new Date(req.body.releaseDate),
    url: req.body.url,
    summary: req.body.summary,
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
      parseBody
    )
  }
}
