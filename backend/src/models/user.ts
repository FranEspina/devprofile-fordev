import { z } from 'zod'
import { UserHashPasswordSchema, UserRegisterSchema, UserLoginSchema, UserDTOSchema, UserCreateSchema } from '../schemas/userSchema'

export type UserHashPassword = z.infer<typeof UserHashPasswordSchema>;
export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserDTO = z.infer<typeof UserDTOSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;

