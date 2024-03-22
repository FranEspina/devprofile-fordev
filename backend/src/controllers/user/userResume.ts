import { Request, Response } from 'express'
import { dbGetUserResumeAsync, dbGetUserBasicResumeAsync, dbSetUserResumeJsonAsync } from '../../services/db'
import { validateSchemaAsync } from '../../services/validationService'
import { JsonResumeSchema, type JSonResume } from '../../schemas/jsonSchema'

export async function getUserResumeAsync(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId)

    const resume = await dbGetUserResumeAsync({ userId, includeIds: false, arrayParsed: true })

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

    const rows = await dbGetUserBasicResumeAsync({ userId, includeIds: false, arrayParsed: true })

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

export async function postUserResumeJsonAsync(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId)
    const json = req.body.json
    const deletePrevious: boolean = req.body.deletePrevious ?? false

    const jsonResume = JSON.parse(json)
    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<typeof JsonResumeSchema, JSonResume>(JsonResumeSchema, jsonResume)
    console.log(errors)
    if (!success || data === undefined) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_BODY',
        message: errors?.join('') || 'Error inesesperado validando datos',
      })
      return
    }

    const rowsaffected = await dbSetUserResumeJsonAsync({ userId, resume: data, deletePrevious })

    return res.status((rowsaffected === 0) ? 404 : 200).json({
      status: (rowsaffected === 0) ? 404 : 200,
      success: true,
      code: (rowsaffected === 0) ? 'NOT_FOUND_POST_USER_RESUME_JSON' : 'OK',
      message: (rowsaffected === 0) ? 'No se insertaron datos' : 'Operación realizada correctamente',
      data: rowsaffected,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_POST_USER_RESUME_JSON',
      message: 'Error inesperado insertando resumen del usuario',
      data: null,
    })
  }
}
