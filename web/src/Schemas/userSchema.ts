import type { TypeOf } from "astro/zod";
import { z } from "astro/zod";

export const UserFormSchema = z.object({
  firstName: z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio'),
  lastName: z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio'),
  password: z.string({
    required_error: 'Campo obligatorio',
  }).min(5, 'Al menos 5 caracteres'),

  passwordConfirmation: z.string({
    required_error: 'Campo obligatorio',
  }).min(1, 'Campo obligatorio'),
  email: z.string({
    required_error: 'Campo obligatorio',
  }).email('Email no válido')
    .min(1, 'Campo obligatorio'),
}).partial();

export const UserRegisterFormSchema = UserFormSchema.required().refine((data) => data.password === data.passwordConfirmation, {
  message: 'No coinciden',
  path: ['passwordConfirmation'],
})

export const UserLoginFormSchema = UserFormSchema.required({
  email: true,
  password: true
});

export type CreateUserInput = Omit<TypeOf<typeof UserRegisterFormSchema>, 'passwordConfirmation'>;

