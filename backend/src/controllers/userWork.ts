import { Request, Response } from 'express'
import { dbGetWorksByUserAsync, dbCreateUserSectionAsync, dbUpdateUserSectionAsync, getUserByIdAsync, dbDeleteUserSectionAsync } from '../services/db'
import { validateSchemaAsync } from '../services/validationService'
import { WorkSchema, WorkCreateSchema, WorkDeleteSchema } from '../schemas/workSchema'
import { UserDeleteSection, Work, WorkCreate, WorkDelete } from '../models/modelSchemas'
import { Schema } from 'zod'

export async function getUserWorks(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId)

    const works = await dbGetWorksByUserAsync(userId)

    return res.status((works.length === 0) ? 404 : 200).json({
      status: (works.length === 0) ? 404 : 200,
      success: true,
      code: (works.length === 0) ? 'NOT_FOUND_GET_USER_WORKS' : 'OK',
      message: (works.length === 0) ? 'No existen datos' : 'Operación realizada correctamente',
      data: works,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_GET_USER_WORKS',
      message: 'Error inesperado recuperando puestoes',
      data: null,
    })
  }
}

export async function createUserWork(req: Request, res: Response) {
  try {

    const userId = Number(req.params.userId)

    const formatBody = {
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
      position: req.body.position,
      startDate: new Date(req.body.startDate),
      endDate: (req.body.endDate) ? new Date(req.body.endDate) : undefined
    }

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, WorkCreate>(WorkCreateSchema, formatBody)
    if (!success || data === undefined) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_BODY',
        message: errors?.join('') || 'Error inesesperado validando datos',
      })
      return
    }

    const user = await getUserByIdAsync(userId)
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        code: 'NOT_FOUND_userId',
        message: 'El usuario no existe',
      })
      return
    }

    if (data.userId !== userId) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_userId',
        message: 'El puesto no es un puesto el usuario',
      })
      return
    }

    const workId = await dbCreateUserSectionAsync('works', data)
    const newWork: Work = {
      id: workId,
      ...data
    }

    return res.status(201).json({
      status: 201,
      success: true,
      code: 'OK',
      message: 'Operación realizada correctamente',
      data: newWork,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_CREATE_USER_WORKS',
      message: 'Error inesperado creando puesto de usuario',
      data: null,
    })
  }
}

export async function updateUserWork(req: Request, res: Response) {
  try {

    const userId = Number(req.params.userId)
    const id = Number(req.params.id)

    const formatBody = {
      id: req.body.id,
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
      position: req.body.position,
      startDate: new Date(req.body.startDate),
      endDate: (req.body.endDate) ? new Date(req.body.endDate) : undefined
    }

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, Work>(WorkSchema, formatBody)
    if (!success || data === undefined) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_BODY',
        message: errors?.join('') || 'Error inesesperado validando datos',
      })
      return
    }

    const user = await getUserByIdAsync(userId)
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        code: 'NOT_FOUND_userId',
        message: 'El usuario no existe',
      })
      return
    }

    if (data.id !== id) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_ID',
        message: 'Identificadores de ruta no válidos',
      })
      return
    }

    if (data.userId !== userId) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_USER_ID',
        message: 'El puesto no es un puesto el usuario',
      })
      return
    }

    await dbUpdateUserSectionAsync('works', data)

    return res.status(200).json({
      status: 200,
      success: true,
      code: 'OK',
      message: 'Operación realizada correctamente',
      data: data,
    })


  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_UPDATE_USER_WORKS',
      message: 'Error inesperado actualizando puesto de usuario',
      data: null,
    })
  }
}

export async function deleteUserWork(req: Request, res: Response) {
  try {

    const userId = Number(req.params.userId)
    const id = Number(req.params.id)

    const workDeleted = { id: id, userId: userId }

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, WorkDelete>(WorkDeleteSchema, workDeleted)
    if (!success || data === undefined) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_DELETE_ROUTE',
        message: errors?.join('') || 'Error inesesperado validando datos',
      })
      return
    }

    const section: UserDeleteSection = {
      tablename: 'works',
      id: workDeleted.id,
      userId: workDeleted.userId
    }

    await dbDeleteUserSectionAsync(section)

    res.status(204).json({
      status: 204,
      success: true,
      code: 'OK',
      message: 'Operación realizada correctamente',
      data: workDeleted,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_DELETE_USER_WORKS',
      message: 'Error inesperado actualizando puesto de usuario',
      data: null,
    })
  }
}
