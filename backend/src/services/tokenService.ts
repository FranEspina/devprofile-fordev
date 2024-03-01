import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export interface TokenPayLoad {
  id: number,
}

export function createAccessToken(payload: TokenPayLoad) {

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.TOKEN_SECRET || '',
      {
        'expiresIn': process.env.TOKEN_EXPIRES_IN
      },
      (err, token) => {
        if (err) reject(err)
        resolve(token)
      }
    )
  })
}

export function verifyAccessToken(token: string): Promise<string | JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET || '',
      (err, tokenDecoded) => {
        if (err) reject(err)
        if (tokenDecoded)
          resolve(tokenDecoded)
        else
          reject('Token no decodificado')
      })
  })
}