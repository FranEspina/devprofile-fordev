import axios from 'axios'

export interface registerType {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

export interface userType {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

export interface registerResultType {
  success: boolean,
  message: string,
  user?: userType,
  token?: string,
}

interface apiResponse {
  success: boolean,
  status: number,
  message: string,
  data?: userType,
  token?: string,
}

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
    return { success: false, message: 'Error inebsperado registrando usuario' }
  }
}