import { RequestHandler } from 'express';
import { getUserByEmail, createUser } from '../services/db'

export const register: RequestHandler = async (req, res) => {

  const user = req.body;

  const { firstName, lastName, email, password } = user;

  const isEmailAllReadyExist = await getUserByEmail(email)
  if (isEmailAllReadyExist) {
    res.status(400).json({
      status: 400,
      success: false,
      code: 'EMAIL_EXIST',
      message: 'El e-mail ya está en uso',
    })
    return
  }

  const newUser = await createUser({ firstName, lastName, email, password })

  res.status(200).json({
    status: 201,
    success: true,
    message: 'Usuario registrado correctamente',
    data: newUser,
  })
}

export const login: RequestHandler = async (req, res) => {

  const user = req.body;
  const { email, password } = user;

  const isUserExist = await getUserByEmail(email)
  if (!isUserExist) {
    res.status(400).json({
      success: false,
      status: 400,
      code: 'USER_NOT_FOUND',
      message: 'Usuario no encontrado',
    })
    return
  }

}

