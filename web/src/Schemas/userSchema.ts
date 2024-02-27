import type { TypeOf } from "astro/zod";
import { z } from "astro/zod";

export const UserFormSchema = z.object({
  firstName: z.string({
    required_error: 'El nombre es obligatorio',
  }).min(1),
  lastName: z.string({
    required_error: 'Los apellidos son obligatorios',
  }).min(1),
  password: z.string({
    required_error: 'La confirmación de contraseña es obligatoria',
  }).min(5, 'Contraseña demasiado corta (5 caracteres mínimo)'),

  passwordConfirmation: z.string({
    required_error: 'La confirmación de contraseña es obligatoria',
  }),
  email: z.string({
    required_error: 'El Email es obligatorio',
  }).email('El email no es válido')
    .min(1),
}).partial();

export const UserRegisterFormSchema = UserFormSchema.required().refine((data) => data.password === data.passwordConfirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['passwordConfirmation'],
})

export const UserLoginFormSchema = UserFormSchema.required({
  email: true,
  password: true
});

export type CreateUserInput = Omit<TypeOf<typeof UserRegisterFormSchema>, 'passwordConfirmation'>;

