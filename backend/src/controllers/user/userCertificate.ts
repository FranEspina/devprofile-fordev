import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { CertificateSchema, CertificateCreateSchema } from '../../schemas/certificateSchema'


function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    name: req.body.name,
    date: req.body.date,
    url: req.body.url,
    issuer: req.body.issuer,
  }
  return formatBody
}

export class UserCertificateController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'certificates',
      'certificado(s)',
      CertificateCreateSchema,
      CertificateSchema,
      DeleteSectionSchema,
      parseBody
    )
  }
}
