import { Request, Response } from 'express'
import { dbGetUserSectionByUserAsync, dbCreateUserSectionAsync, dbUpdateUserSectionAsync, getUserByIdAsync, dbDeleteUserSectionAsync } from '../../services/db'
import { validateSchemaAsync } from '../../services/validationService'
import { Schema } from 'zod'
import { UserDeleteSection } from '../../models/modelSchemas'

export class UserSectionController<T extends { id: number } & Record<string, unknown>>{

  constructor(
    private tableName: string,
    private tableDesc: string,
    private createSchema: Schema,
    private updateSchema: Schema,
    private deleteSchema: Schema,
    private bodyParser: (req: Request) => { [key: string]: unknown }) {
  }

  async getUserSectionAsync(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId)

      const rows = await dbGetUserSectionByUserAsync<T>(this.tableName, userId)

      return res.status((rows.length === 0) ? 404 : 200).json({
        status: (rows.length === 0) ? 404 : 200,
        success: true,
        code: (rows.length === 0) ? `NOT_FOUND_GET_USER_${this.tableName.toUpperCase()}` : 'OK',
        message: (rows.length === 0) ? 'No existen datos' : 'Operación realizada correctamente',
        data: rows,
      })

    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 500,
        success: true,
        code: `UNEXPECTED_ERROR_GET_USER_${this.tableName.toUpperCase()}`,
        message: `Error inesperado recuperando ${this.tableDesc}`,
        data: null,
      })
    }
  }

  async createUserSection<TOutModel extends { userId: number }>(req: Request, res: Response) {
    try {

      const userId = Number(req.params.userId)
      const bodyParsed = this.bodyParser(req)

      //TODO: Pasar a un middleware de express
      const { success, data, errors } = await validateSchemaAsync<Schema, TOutModel>(this.createSchema, bodyParsed)
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
          code: 'NOT_FOUND_USER_ID',
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

      const newId = await dbCreateUserSectionAsync(this.tableName, data)
      const newSection = {
        id: newId,
        ...data
      }

      return res.status(201).json({
        status: 201,
        success: true,
        code: 'OK',
        message: 'Operación realizada correctamente',
        data: newSection,
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

  async updateUserSection<TOutModel extends { userId: number }>(req: Request, res: Response) {
    try {

      const userId = Number(req.params.userId)
      const id = Number(req.params.id)
      const bodyParsed = this.bodyParser(req)
      bodyParsed.id = req.body.id

      if (bodyParsed.id !== id) {
        res.status(400).json({
          status: 400,
          success: false,
          code: 'INVALID_ID',
          message: 'Identificadores de ruta no válidos',
        })
        return
      }

      const { success, data, errors } = await validateSchemaAsync<Schema, TOutModel>(this.updateSchema, bodyParsed)
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
          code: 'NOT_FOUND_USER_ID',
          message: 'El usuario no existe',
        })
        return
      }

      if (data.userId !== userId) {
        res.status(400).json({
          status: 400,
          success: false,
          code: 'INVALID_USER_ID',
          message: `El ${this.tableDesc} no es un ${this.tableDesc} del usuario`,
        })
        return
      }

      await dbUpdateUserSectionAsync(this.tableName, data)

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
        code: `UNEXPECTED_ERROR_UPDATE_USER_${this.tableName.toUpperCase()}`,
        message: `Error inesperado actualizando sección: ${this.tableDesc}`,
        data: null,
      })
    }
  }

  async deleteUserSection(req: Request, res: Response) {
    try {

      const userId = Number(req.params.userId)
      const id = Number(req.params.id)

      const sectionToDelete = { id: id, userId: userId }

      const { success, data, errors } = await validateSchemaAsync<Schema, typeof sectionToDelete>(this.deleteSchema, sectionToDelete)
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
        tablename: this.tableName,
        id: sectionToDelete.id,
        userId: sectionToDelete.userId
      }

      await dbDeleteUserSectionAsync(section)

      res.status(204).json({
        status: 204,
        success: true,
        code: 'OK',
        message: 'Operación realizada correctamente',
        data: sectionToDelete,
      })

    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 500,
        success: true,
        code: `UNEXPECTED_ERROR_DELETE_USER_${this.tableName.toUpperCase()}`,
        message: `Error inesperado eliminando sección de usuario: ${this.tableDesc}`,
        data: null,
      })
    }
  }

}