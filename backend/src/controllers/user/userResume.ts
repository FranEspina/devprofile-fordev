import { Request, Response } from 'express'
import { dbGetUserResumeAsync } from '../../services/db'

export async function getUserResumeAsync(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId)

    const resume = await dbGetUserResumeAsync(userId)

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