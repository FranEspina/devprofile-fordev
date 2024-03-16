import { Request, Response } from 'express'
import { dbGetUserResumeAsync, dbGetUserBasicResumeAsync } from '../../services/db'

export async function getUserResumeAsync(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId)

    const resume = await dbGetUserResumeAsync(userId, false)

    return res.status(200).json({
      status: 200,
      success: true,
      code: 'OK',
      message: 'Operación realizada correctamente',
      data: resume,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_GET_USER_RESUME',
      message: 'Error inesperado recuperando cv público',
      data: null,
    })
  }
}

export async function getUserBasicResumeAsync(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId)

    const rows = await dbGetUserBasicResumeAsync(userId, true)

    return res.status((rows.length === 0) ? 404 : 200).json({
      status: (rows.length === 0) ? 404 : 200,
      success: true,
      code: (rows.length === 0) ? 'NOT_FOUND_GET_USER_RESUME_BASIC' : 'OK',
      message: (rows.length === 0) ? 'No existen datos' : 'Operación realizada correctamente',
      data: rows,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_GET_USER_RESUME_BASIC',
      message: 'Error inesperado recuperando datos básicos',
      data: null,
    })
  }
}