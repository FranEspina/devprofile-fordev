import { UserSectionBaseController } from './base/UserSectionBaseController'
import { CreateSectionSchema, DeleteSectionSchema, SectionSchema } from '../../schemas/sectionSchema'
import { Request, Response } from 'express'
import { dbGetUserSectionDataAsync } from '../../services/db'

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
      false,
      parseBody
    )
  }
}

export async function getUserSectionDataAsync(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId)

    const rows = await dbGetUserSectionDataAsync(userId)

    return res.status((rows.length === 0) ? 404 : 200).json({
      status: (rows.length === 0) ? 404 : 200,
      success: true,
      code: (rows.length === 0) ? 'NOT_FOUND_GET_USER_SECTIONDATA' : 'OK',
      message: (rows.length === 0) ? 'No existen datos' : 'Operación realizada correctamente',
      data: rows,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_GET_USER_SECTIONDATA',
      message: 'Error inesperado recuperando datos de secciones',
      data: null,
    })
  }
}