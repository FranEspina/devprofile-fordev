import axios from 'axios'
import type { registerType, registerResultType, loginType, apiResponse } from '@/types/apiTypes.ts'



export async function register(user: registerType): Promise<registerResultType> {

  const baseUrl = 'https://devprofile-fordev-dev-knsf.1.ie-1.fl0.io/auth/register'

  try {

    const response = await axios.post(baseUrl, user)
    console.log(response)

    const results: apiResponse = response.data
    if (results.success === true) {

      return { success: true, message: 'Usuario registrado correctamente', user: results.data, token: results.token }

    }

    console.log(results)
    return { success: false, message: results.message }
  }
  catch (error) {
    console.log(error)
    return { success: false, message: 'Error inesperado registrando usuario' }
  }
}

export async function login(userLogin: loginType): Promise<registerResultType> {

  const baseUrl = 'https://devprofile-fordev-dev-knsf.1.ie-1.fl0.io/auth/login'

  try {
    const response = await axios.post(baseUrl, userLogin)
    console.log(response)
    const results: apiResponse = response.data
    if (results.success === true) {
      return { success: true, message: 'Usuario logado correctamente', user: results.data, token: results.token }
    }
    console.log(results)
    return { success: false, message: results.message }
  }
  catch (error) {
    console.log(error)
    return { success: false, message: 'Error inesperado iniciando sesión' }
  }
}