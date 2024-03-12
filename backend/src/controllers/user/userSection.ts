import { UserSectionBaseController } from './base/UserSectionBaseController'
import { CreateSectionSchema, DeleteSectionSchema, SectionSchema } from '../../schemas/sectionSchema'
import { Request } from 'express'

function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    sectionName: req.body.sectionName,
    sectionId: req.body.sectionId,
    isPublic: req.body.isPublic,
  }
  return formatBody
}

export class UserSectionController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'sections',
      'seccción(es)',
      CreateSectionSchema,
      SectionSchema,
      DeleteSectionSchema,
      parseBody
    )
  }
}