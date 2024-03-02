import { Request, Response } from 'express'
import { dbGetResourcesByUserAsync, dbCreateUserResourceAsync, dbUpdateUserResourceAsync, getUserByIdAsync, dbDeleteUserResourceAsync } from '../services/db'
import { validateSchemaAsync } from '../services/validationService'
import { DevResourceSchema, DevResourceCreateSchema, DevResourceDeleteSchema } from '../schemas/devResourceSchema';
import { DevResource, DevResourceCreate, DevResourceDelete } from '../models/devResource';
import { Schema } from 'zod'

export async function getUserResources(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const resources = await dbGetResourcesByUserAsync(id)

    return res.status((resources.length === 0) ? 404 : 200).json({
      status: (resources.length === 0) ? 404 : 200,
      success: true,
      code: (resources.length === 0) ? 'NOT_FOUND_GET_USER_RESOURCES' : 'OK',
      message: (resources.length === 0) ? 'No existen datos' : 'Operación realizada correctamente',
      data: resources,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_GET_USER_RESOURCES',
      message: 'Error inesperado recuperando recursos',
      data: null,
    })
  }
}


export async function createUserResource(req: Request, res: Response) {
  try {

    const id = Number(req.params.id);

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, DevResourceCreate>(DevResourceCreateSchema, req.body)
    if (!success || data === undefined) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_BODY',
        message: errors?.join(';') || 'Error inesesperado validando datos',
      })
      return
    }

    const user = await getUserByIdAsync(id)
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        code: 'NOT_FOUND_userId',
        message: 'El usuario no existe',
      })
      return
    }

    if (data.userId !== id) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_userId',
        message: 'El recurso no es un recurso el usuario',
      })
      return
    }

    const resource = await dbCreateUserResourceAsync(data)

    return res.status(201).json({
      status: 201,
      success: true,
      code: 'OK',
      message: 'Operación realizada correctamente',
      data: resource,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_CREATE_USER_RESOURCES',
      message: 'Error inesperado creand recurso de usuario',
      data: null,
    })
  }
}

export async function updateUserResource(req: Request, res: Response) {
  try {

    const id = Number(req.params.id);

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, DevResource>(DevResourceSchema, req.body)
    if (!success || data === undefined) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_BODY',
        message: errors?.join(';') || 'Error inesesperado validando datos',
      })
      return
    }

    const user = await getUserByIdAsync(id)
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        code: 'NOT_FOUND_userId',
        message: 'El usuario no existe',
      })
      return
    }

    if (data.userId !== id) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_userId',
        message: 'El recurso no es un recurso el usuario',
      })
      return
    }

    const resource = await dbUpdateUserResourceAsync(data)

    return res.status(200).json({
      status: 200,
      success: true,
      code: 'OK',
      message: 'Operación realizada correctamente',
      data: resource,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_UPDATE_USER_RESOURCES',
      message: 'Error inesperado actualizando recurso de usuario',
      data: null,
    })
  }
}

export async function deleteUserResource(req: Request, res: Response) {
  try {

    const id = Number(req.params.id);

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, DevResourceDelete>(DevResourceDeleteSchema, req.body)
    if (!success || data === undefined) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_BODY',
        message: errors?.join(';') || 'Error inesesperado validando datos',
      })
      return
    }

    const user = await getUserByIdAsync(id)
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        code: 'NOT_FOUND_userId',
        message: 'El usuario no existe',
      })
      return
    }

    if (data.userId !== id) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_userId',
        message: 'El recurso no es un recurso el usuario',
      })
      return
    }

    await dbDeleteUserResourceAsync(data)

    return res.status(204).json({
      status: 204,
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
      code: 'UNEXPECTED_ERROR_DELETE_USER_RESOURCES',
      message: 'Error inesperado actualizando recurso de usuario',
      data: null,
    })
  }
}

