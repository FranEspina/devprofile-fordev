import { Request, Response } from 'express'
import { dbGetProfilesByUserAsync, dbCreateUserProfileAsync, dbUpdateUserProfileAsync, getUserByIdAsync, dbDeleteUserProfileAsync } from '../services/db'
import { validateSchemaAsync } from '../services/validationService'
import { ProfileSchema, ProfileCreateSchema, ProfileDeleteSchema } from '../schemas/profileSchema';
import { Profile, ProfileCreate, ProfileDelete } from '../models/modelSchemas';
import { Schema } from 'zod'

export async function getUserProfiles(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const profiles = await dbGetProfilesByUserAsync(id)

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

    const id = Number(req.params.id);

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, ProfileCreate>(ProfileCreateSchema, req.body)
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

    const id = Number(req.params.id);

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, Profile>(ProfileSchema, req.body)
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

    const id = Number(req.params.id);

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, ProfileDelete>(ProfileDeleteSchema, req.body)
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
        message: 'El perfil no es un perfil el usuario',
      })
      return
    }

    await dbDeleteUserProfileAsync(data)

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
      code: 'UNEXPECTED_ERROR_DELETE_USER_PROFILES',
      message: 'Error inesperado actualizando perfil de usuario',
      data: null,
    })
  }
}
