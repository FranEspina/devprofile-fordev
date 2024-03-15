import axios from 'axios'
import type { apiRegisterType, apiResultType, apiLoginType, apiResponse, apiUserDto, apiDevResourceDto, IAuthHeader } from '@/types/apiTypes.ts'
import type { ResourceRow } from '@/Schemas/resourceSchema'
import type { ProfileCreate, ProfileDelete } from '@/Schemas/profileSchema'


//const API_BASE_URL = 'https://devprofile-fordev-dev-knsf.1.ie-1.fl0.io'
const API_BASE_URL = 'http://localhost:3000'

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
      console.log('Error axios:', error.message);
      if (error.response) {
        const results: apiResponse<apiDevResourceDto[]> = error.response.data
        if (results) {
          return { success: false, message: 'Error inesperado recuperando recursos' }
        }
      }
    } else if (error instanceof Error) {
      console.log('Exception:', error.message);
    } else if (typeof error === "string") {
      console.log('Error:', error);
    } else {
      console.log('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado recuperando recursos' }

  }
}

export async function getDevUserDevResourcesRow(id: number, token: string) {
  const endpoint = `${API_BASE_URL}/user/${id}/resource`
  try {
    const response = await axios.get(endpoint, authHeader(token))
    const results: apiResponse<ResourceRow[]> = response.data
    if (results.success === true) {
      return { success: true, message: 'Operación realizada con éxito', data: results.data }
    }
    return { success: false, message: results.message }
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      console.log('Error axios:', error.message);
      if (error.response) {
        const results: apiResponse<ResourceRow[]> = error.response.data
        if (results) {
          return { success: false, message: 'Error inesperado recuperando recursos' }
        }
      }
    } else if (error instanceof Error) {
      console.log('Exception:', error.message);
    } else if (typeof error === "string") {
      console.log('Error:', error);
    } else {
      console.log('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado recuperando recursos' }

  }
}

export async function createUserDevResource(resource: apiDevResourceDto, token: string): Promise<apiResultType<apiDevResourceDto>> {

  console.log(resource)
  const endpoint = `${API_BASE_URL}/user/${resource.userId}/resource`

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
      console.log('Error axios:', error.message);
      if (error.response) {
        const results: apiResponse<apiUserDto> = error.response.data
        if (results) {
          return { success: false, message: 'Error inesperado iniciando sesión' }
        }
      }
    } else if (error instanceof Error) {
      console.log('Exception:', error.message);
    } else if (typeof error === "string") {
      console.log('Error:', error);
    } else {
      console.log('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado iniciando sesión' }

  }
}

export async function createUserSection<T>(sectionName: string, userSection: T, userId: number, token: string): Promise<apiResultType<T>> {
  const endpoint = `${API_BASE_URL}/user/${userId}/${sectionName}`
  try {
    const response = await axios.post(endpoint, userSection, authHeader(token))
    const results: apiResponse<T> = response.data
    if (results.success === true) {
      return { success: true, message: 'Sección creada correctamente', data: results.data }
    }
    return { success: false, message: results.message }
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      console.log(error.message);
      if (error.response) {
        const results: apiResponse<T> = error.response.data
        if (results) {
          return { success: false, message: 'Error inesperado creando sección' }
        }
      }
    } else if (error instanceof Error) {
      console.log('Exception:', error.message);
    } else if (typeof error === "string") {
      console.log('Error:', error);
    } else {
      console.log('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado creando sección' }

  }
}

export async function getUserSection<T>(section: string, id: number, token: string) {
  const endpoint = `${API_BASE_URL}/user/${id}/${section}`
  console.log(endpoint)
  try {
    const response = await axios.get(endpoint, authHeader(token))
    const results: apiResponse<T[]> = response.data
    console.log(results)
    if (results.success === true) {
      return { success: true, message: 'Operación realizada con éxito', data: results.data }
    }
    return { success: false, message: results.message }
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      console.log('Error axios:', error.message);
      if (error.response) {
        const results: apiResponse<T[]> = error.response.data
        if (results) {
          return { success: false, message: 'Error inesperado recuperando puestos' }
        }
      }
    } else if (error instanceof Error) {
      console.log('Exception:', error.message);
    } else if (typeof error === "string") {
      console.log('Error:', error);
    } else {
      console.log('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado recuperando puestos' }

  }
}

export interface UserSection {
  id: number,
  userId: number,
}

export async function deleteUserSection<T extends UserSection>(sectionName: string, userSection: UserSection, token: string): Promise<apiResultType<ProfileDelete>> {

  const endpoint = `${API_BASE_URL}/user/${userSection.userId}/${sectionName}/${userSection.id}`
  try {
    await axios.delete(endpoint, authHeader(token))
    return { success: true, message: 'Sección eliminada correctamente', data: userSection }
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    } else if (error instanceof Error) {
      console.log('Exception:', error.message);
    } else if (typeof error === "string") {
      console.log('Error:', error);
    } else {
      console.log('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado eliminando sección', data: userSection }

  }
}

export async function updateUserSection<T extends UserSection>(sectionName: string, userSection: T, token: string): Promise<apiResultType<T>> {

  const endpoint = `${API_BASE_URL}/user/${userSection.userId}/${sectionName}/${userSection.id}`

  try {
    const response = await axios.put(endpoint, userSection, authHeader(token))
    const results: apiResponse<T> = response.data

    if (results.success === true) {
      return { success: true, message: 'Sección actualizada correctamente', data: results.data }
    }
    return { success: false, message: 'Error inesperado actualizando sección' }

  } catch (error) {
    console.log(error)
    console.log(axios.isAxiosError(error))
    if (axios.isAxiosError(error)) {
      console.log(error.message);
      if (error.response) {
        const results: apiResponse<ProfileCreate> = error.response.data
        if (results) {
          return { success: false, message: 'Error inesperado actualizando sección' }
        }
      }
    } else if (error instanceof Error) {
      console.log('Exception:', error.message);
    } else if (typeof error === "string") {
      console.log('Error:', error);
    } else {
      console.log('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado actualizando sección' }

  }
}

export async function getUserResume<T>(id: number) {
  const endpoint = `${API_BASE_URL}/user/${id}/resume`
  try {
    const response = await axios.get(endpoint)
    const results: apiResponse<unknown> = response.data
    if (results.success === true) {
      return { success: true, message: 'Operación realizada con éxito', data: results.data }
    }
    return { success: false, message: results.message }
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      console.log('Error axios:', error.message);
      if (error.response) {
        const results: apiResponse<T[]> = error.response.data
        if (results) {
          return { success: false, message: 'Error inesperado recuperando resumen' }
        }
      }
    } else if (error instanceof Error) {
      console.log('Exception:', error.message);
    } else if (typeof error === "string") {
      console.log('Error:', error);
    } else {
      console.log('Unknow error:', error);
    }

    return { success: false, message: 'Error inesperado recuperando resumen' }

  }
}