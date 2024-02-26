import jwt from 'jsonwebtoken'

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