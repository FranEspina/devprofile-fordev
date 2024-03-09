import { Request, Response } from 'express'
import { dbGetUserSectionByUserAsync, dbCreateUserSectionAsync, dbUpdateUserSectionAsync, getUserByIdAsync, dbDeleteUserSectionAsync } from '../services/db'
import { validateSchemaAsync } from '../services/validationService'
import { ProjectSchema, ProjectCreateSchema, ProjectDeleteSchema } from '../schemas/projectSchema'
import { UserDeleteSection, Project, ProjectCreate, ProjectDelete } from '../models/modelSchemas'
import { Schema } from 'zod'

const TABLE_NAME: string = 'projects'
const TABLE_DESC: string = 'proyectos'

export async function getUserProjects(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId)

    const rows = await dbGetUserSectionByUserAsync<Project>(TABLE_NAME, userId)

    return res.status((rows.length === 0) ? 404 : 200).json({
      status: (rows.length === 0) ? 404 : 200,
      success: true,
      code: (rows.length === 0) ? `NOT_FOUND_GET_USER_${TABLE_NAME.toUpperCase()}` : 'OK',
      message: (rows.length === 0) ? 'No existen datos' : 'Operación realizada correctamente',
      data: rows,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: `UNEXPECTED_ERROR_GET_USER_${TABLE_NAME.toUpperCase()}`,
      message: `Error inesperado recuperando ${TABLE_DESC}`,
      data: null,
    })
  }
}

export async function createUserProject(req: Request, res: Response) {
  try {

    const userId = Number(req.params.userId)

    const formatBody = {
      userId: req.body.userId,
      name: req.body.name,
      description: req.body.description,
      highlights: req.body.highlights,
      keywords: req.body.highlights,
      startDate: new Date(req.body.startDate),
      endDate: (req.body.endDate) ? new Date(req.body.endDate) : undefined,
      url: req.body.url,
      roles: req.body.roles,
      entity: req.body.entity,
      type: req.body.type,
    }

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, ProjectCreate>(ProjectCreateSchema, formatBody)
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
        message: `El ${TABLE_DESC} no es un ${TABLE_DESC} el usuario`,
      })
      return
    }

    const newId = await dbCreateUserSectionAsync(TABLE_NAME, data)
    const created: Project = {
      id: newId,
      ...data
    }

    return res.status(201).json({
      status: 201,
      success: true,
      code: 'OK',
      message: 'Operación realizada correctamente',
      data: created,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: `UNEXPECTED_ERROR_CREATE_USER_${TABLE_NAME.toUpperCase()}`,
      message: `Error inesperado creando ${TABLE_DESC} de usuario`,
      data: null,
    })
  }
}

export async function updateUserProject(req: Request, res: Response) {
  try {

    const userId = Number(req.params.userId)
    const id = Number(req.params.id)

    const formatBody = {
      id: req.body.id,
      userId: req.body.userId,
      name: req.body.name,
      description: req.body.description,
      highlights: req.body.highlights,
      keywords: req.body.highlights,
      startDate: new Date(req.body.startDate),
      endDate: (req.body.endDate) ? new Date(req.body.endDate) : undefined,
      url: req.body.url,
      roles: req.body.roles,
      entity: req.body.entity,
      type: req.body.type
    }

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, Project>(ProjectSchema, formatBody)
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
        message: `El ${TABLE_DESC} no es un ${TABLE_DESC} el usuario`,
      })
      return
    }

    await dbUpdateUserSectionAsync(TABLE_NAME, data)

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
      code: `UNEXPECTED_ERROR_UPDATE_USER_${TABLE_NAME.toLowerCase()}`,
      message: `Error inesperado actualizando ${TABLE_DESC} de usuario`,
      data: null,
    })
  }
}

export async function deleteUserProject(req: Request, res: Response) {
  try {

    const userId = Number(req.params.userId)
    const id = Number(req.params.id)

    const deleted = { id: id, userId: userId }

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, ProjectDelete>(ProjectDeleteSchema, deleted)
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
      tablename: TABLE_NAME,
      ...deleted
    }

    await dbDeleteUserSectionAsync(section)

    res.status(204).json({
      status: 204,
      success: true,
      code: 'OK',
      message: 'Operación realizada correctamente',
      data: deleted,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: `UNEXPECTED_ERROR_DELETE_USER_${TABLE_NAME.toUpperCase()}`,
      message: `Error inesperado actualizando ${TABLE_DESC} de usuario`,
      data: null,
    })
  }
}
