import { z } from 'zod'

const UserSchema = z.object(
  {
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    hashPassword: z.string(),
  }
)

export const UserHashPasswordSchema = UserSchema.omit({
  password: true
})

export const UserCreateSchema = UserSchema.omit({
  id: true,
  password: true
})

export const UserRegisterSchema = UserSchema.omit({
  id: true,
  hashPassword: true
})

export const UserLoginSchema = UserSchema.omit({
  id: true,
  firstName: true,
  lastName: true,
  hashPassword: true
})

export const UserDTOSchema = UserSchema.omit({
  password: true,
  hashPassword: true
})
