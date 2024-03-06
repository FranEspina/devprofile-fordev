import { Request, Response } from 'express'
import { dbGetProfilesByUserAsync, dbCreateUserProfileAsync, dbUpdateUserProfileAsync, getUserByIdAsync, dbDeleteUserProfileAsync } from '../services/db'
import { validateSchemaAsync } from '../services/validationService'
import { ProfileSchema, ProfileCreateSchema, ProfileDeleteSchema } from '../schemas/profileSchema'
import { Profile, ProfileCreate, ProfileDelete } from '../models/modelSchemas'
import { Schema } from 'zod'

export async function getUserProfiles(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId)

    const profiles = await dbGetProfilesByUserAsync(userId)

    return res.status((profiles.length === 0) ? 404 : 200).json({
      status: (profiles.length === 0) ? 404 : 200,
      success: true,
      code: (profiles.length === 0) ? 'NOT_FOUND_GET_USER_PROFILES' : 'OK',
      message: (profiles.length === 0) ? 'No existen datos' : 'Operación realizada correctamente',
      data: profiles,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_GET_USER_PROFILES',
      message: 'Error inesperado recuperando perfiles',
      data: null,
    })
  }
}

export async function createUserProfile(req: Request, res: Response) {
  try {

    const userId = Number(req.params.userId)

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, ProfileCreate>(ProfileCreateSchema, req.body)
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
        message: 'El perfil no es un perfil el usuario',
      })
      return
    }

    const profile = await dbCreateUserProfileAsync(data)

    return res.status(201).json({
      status: 201,
      success: true,
      code: 'OK',
      message: 'Operación realizada correctamente',
      data: profile,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_CREATE_USER_PROFILES',
      message: 'Error inesperado creando perfil de usuario',
      data: null,
    })
  }
}

export async function updateUserProfile(req: Request, res: Response) {
  try {

    const userId = Number(req.params.userId)
    const id = Number(req.params.id)


    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, Profile>(ProfileSchema, req.body)
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
        message: 'El perfil no es un perfil el usuario',
      })
      return
    }


    const profile = await dbUpdateUserProfileAsync(data)

    return res.status(200).json({
      status: 200,
      success: true,
      code: 'OK',
      message: 'Operación realizada correctamente',
      data: profile,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_UPDATE_USER_PROFILES',
      message: 'Error inesperado actualizando perfil de usuario',
      data: null,
    })
  }
}

export async function deleteUserProfile(req: Request, res: Response) {
  try {

    const userId = Number(req.params.userId)
    const id = Number(req.params.id)

    const profileDeleted = { id: id, userId: userId }

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, ProfileDelete>(ProfileCreateSchema, profileDeleted)
    if (!success || data === undefined) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_DELETE_ROUTE',
        message: errors?.join('') || 'Error inesesperado validando datos',
      })
      return
    }


    await dbDeleteUserProfileAsync(data)

    return res.status(204).json({
      status: 204,
      success: true,
      code: 'OK',
      message: 'Operación realizada correctamente',
      data: profileDeleted,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: true,
      code: 'UNEXPECTED_ERROR_DELETE_USER_PROFILES',
      message: 'Error inesperado actualizando perfil de usuario',
      data: null,
    })
  }
}
