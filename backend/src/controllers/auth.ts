import { RequestHandler } from 'express';
import { getUserByEmailAsync, createUserAsync } from '../services/db'
import { createAccessToken, TokenPayLoad } from '../services/tokenService'
import { hashAsync, compareHashAsync } from '../services/cryptService'
import { validateSchemaAsync } from '../services/validationService'
import { UserLoginSchema, UserRegisterSchema } from '../schemas/userSchema'
import { UserDTO, UserLogin, UserRegister } from '../models/user'
import { Schema } from 'zod';


export const register: RequestHandler = async (req, res) => {
  try {

    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, UserRegister>(UserRegisterSchema, req.body)
    if (!success || data === undefined) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_BODY',
        message: errors?.join(';') || 'Error inesesperado validando datos',
      })
      return
    }

    const { firstName, lastName, email, password } = data
    const userSaved = await getUserByEmailAsync(email)
    if (userSaved) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'EMAIL_EXIST',
        message: 'El e-mail ya está en uso',
      })
      return
    }

    const hashPassword = await hashAsync(password)
    const newUser = await createUserAsync({ firstName, lastName, email, hashPassword })
    const payload: TokenPayLoad = { id: newUser.id }
    const token = await createAccessToken(payload)

    const userDTO: UserDTO = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    }

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Usuario registrado correctamente',
      code: 'OK',
      data: userDTO,
      token: token
    })
  }
  catch (error) {
    console.log(error)
    res.status(500).json({
      status: 500,
      success: false,
      code: 'UNEXPECTED_ERROR_REGISTERING',
      message: 'error inesperado registrando usuario'
    })
  }

}

export const login: RequestHandler = async (req, res) => {

  try {
    //TODO: Pasar a un middleware de express
    const { success, data, errors } = await validateSchemaAsync<Schema, UserLogin>(UserLoginSchema, req.body)
    if (!success || data === undefined) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID_BODY',
        message: errors?.join(';') || 'Error inesesperado validando datos',
      })
      return
    }

    const { email, password } = data;

    const userSaved = await getUserByEmailAsync(email)
    if (!userSaved) {
      res.status(400).json({
        success: false,
        status: 400,
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado',
      })
      return
    }

    const okPassword = await compareHashAsync(password, userSaved.hashPassword)

    if (!okPassword) {
      return res.status(400)
        .json({
          success: false,
          status: 400,
          code: 'USER_OR_PASSWORD_WRONG',
          message: 'Usuario y/o contraseña incorrectos'
        })
    }

    const payload: TokenPayLoad = { id: userSaved.id }
    const token = await createAccessToken(payload)

    const userDTO: UserDTO = {
      id: userSaved.id,
      email: userSaved.email,
      firstName: userSaved.firstName,
      lastName: userSaved.lastName,
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Usuario logado correctamente',
      code: 'OK',
      data: userDTO,
      token: token
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 500,
      success: false,
      code: 'UNEXPECTED_ERROR_REGISTERING',
      message: 'error inesperado iniciando sesión de usuario'
    })
  }

}

