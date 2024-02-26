import { RequestHandler } from 'express';
import { getUserByEmail, createUser } from '../services/db'
import { createAccessToken, TokenPayLoad } from '../services/tokenService'
import { hashAsync, compareHashAsync } from '../services/cryptService'

export const register: RequestHandler = async (req, res) => {
  try {
    const user = req.body;

    const { firstName, lastName, email, password } = user;

    const userSaved = await getUserByEmail(email)
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
    const newUser = await createUser({ firstName, lastName, email, hashPassword })
    const payload: TokenPayLoad = { id: newUser.id }
    const token = await createAccessToken(payload)

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Usuario registrado correctamente',
      data: newUser,
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

  const user = req.body;
  const { email, password } = user;

  const userSaved = await getUserByEmail(email)
  if (!userSaved) {
    res.status(400).json({
      success: false,
      status: 400,
      code: 'USER_NOT_FOUND',
      message: 'Usuario no encontrado',
    })
    return
  }

  const okPassword = await compareHashAsync(password, userSaved.password)

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

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Usuario logado correctamente',
    data: userSaved,
    token: token
  })

}

