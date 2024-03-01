import { Request, Response, NextFunction } from 'express';
import { CustomRequest, verifyAccessToken } from '../services/tokenService';

export const auth = async (req: Request, res: Response, next: NextFunction) => {

  let token: string | undefined = ''

  try {
    token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({
        status: 401,
        success: false,
        code: 'TOKEN_REQUIRED',
        message: 'El token de autorización no se ha proporcionado.',
      })
      return
    }
  } catch (error) {
    console.log(error)
    res.status(401).json({
      status: 401,
      success: false,
      code: 'TOKEN_INVALID_BEARER',
      message: 'Error inesperado autenticando',
    })
    return
  }

  try {
    const decoded = await verifyAccessToken(token);
    (req as CustomRequest).token = decoded;
    next();
  }
  catch (error) {
    res.status(401).json({
      status: 401,
      success: false,
      code: 'TOKEN_INVALID',
      message: 'El token de autorización no se ha proporcionado o no es válido.',
    })
    return
  }
}
