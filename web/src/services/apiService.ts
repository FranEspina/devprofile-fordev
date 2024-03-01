import axios from 'axios'
import type { apiRegisterType, apiResultType, apiLoginType, apiResponse, apiUserDto, apiDevResourceDto, IAuthHeader } from '@/types/apiTypes.ts'

const API_BASE_URL = 'https://devprofile-fordev-dev-knsf.1.ie-1.fl0.io'

export async function register(user: apiRegisterType): Promise<apiResultType<apiUserDto>> {

  const endpoint = `${API_BASE_URL}/auth/register`

  try {

    const response = await axios.post(endpoint, user)
    const results: apiResponse<apiUserDto> = response.data
    if (results.success === true) {
      return { success: true, message: 'Usuario registrado correctamente', data: results.data, token: results.token }
    }

    return { success: false, message: results.message }
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error axios:', error.message);
      if (error.response) {
        const results: apiResponse<apiUserDto> = error.response.data
        if (results) {
          return { success: false, message: results.message }
        }
      }
    } else if (error instanceof Error) {
      console.error('Exception:', error.message);
    } else if (typeof error === "string") {
      console.error('Error:', error);
    } else {
      console.error('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado registrando usuario' }
  }
}

export async function login(userLogin: apiLoginType): Promise<apiResultType<apiUserDto>> {

  const endpoint = `${API_BASE_URL}/auth/login`

  try {
    const response = await axios.post(endpoint, userLogin)
    const results: apiResponse<apiUserDto> = response.data
    if (results.success === true) {
      return { success: true, message: 'Usuario logado correctamente', data: results.data, token: results.token }
    }
    return { success: false, message: results.message }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error axios:', error.message);
      if (error.response) {
        const results: apiResponse<apiUserDto> = error.response.data
        if (results) {
          return { success: false, message: results.message }
        }
      }
    } else if (error instanceof Error) {
      console.error('Exception:', error.message);
    } else if (typeof error === "string") {
      console.error('Error:', error);
    } else {
      console.error('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado iniciando sesión' }

  }
}

const authHeader = (token: string): IAuthHeader => {
  return {
    headers: {
      Authorization: "Bearer " + token,
    },
  }
}


export async function getDevUserDevResources(id: number, token: string) {
  const endpoint = `${API_BASE_URL}/user/${id}/resource`
  console.log(endpoint)
  try {
    const response = await axios.get(endpoint, authHeader(token))
    const results: apiResponse<apiDevResourceDto[]> = response.data
    if (results.success === true) {
      return { success: true, message: 'Operación realizada con éxito', data: results.data }
    }
    return { success: false, message: results.message }
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      console.error('Error axios:', error.message);
      if (error.response) {
        const results: apiResponse<apiDevResourceDto[]> = error.response.data
        if (results) {
          return { success: false, message: results.message }
        }
      }
    } else if (error instanceof Error) {
      console.error('Exception:', error.message);
    } else if (typeof error === "string") {
      console.error('Error:', error);
    } else {
      console.error('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado recuperando recursos' }

  }
}

export async function createUserDevResource(resource: apiDevResourceDto, token: string): Promise<apiResultType<apiDevResourceDto>> {

  console.log(resource)
  const endpoint = `${API_BASE_URL}/user/${resource.userId}/resource`

  console.log(endpoint)
  try {
    const response = await axios.post(endpoint, resource, authHeader(token))
    console.log(response)
    const results: apiResponse<apiDevResourceDto> = response.data
    if (results.success === true) {
      return { success: true, message: 'Recurso creado correctamente', data: results.data, token: results.token }
    }
    return { success: false, message: results.message }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error axios:', error.message);
      if (error.response) {
        const results: apiResponse<apiUserDto> = error.response.data
        if (results) {
          return { success: false, message: results.message }
        }
      }
    } else if (error instanceof Error) {
      console.error('Exception:', error.message);
    } else if (typeof error === "string") {
      console.error('Error:', error);
    } else {
      console.error('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado iniciando sesión' }

  }
}