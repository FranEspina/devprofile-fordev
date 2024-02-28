import axios from 'axios'
import type { registerType, registerResultType, loginType, apiResponse } from '@/types/apiTypes.ts'

const API_BASE_URL = 'https://devprofile-fordev-dev-knsf.1.ie-1.fl0.io'

export async function register(user: registerType): Promise<registerResultType> {

  const baseUrl = `${API_BASE_URL}/auth/register`

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
    if (axios.isAxiosError(error)) {
      console.error('Error axios:', error.message);
      if (error.response) {
        const results: apiResponse = error.response.data
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

export async function login(userLogin: loginType): Promise<registerResultType> {

  const baseUrl = `${API_BASE_URL}/auth/login`

  try {
    const response = await axios.post(baseUrl, userLogin)
    console.log(response)
    const results: apiResponse = response.data
    if (results.success === true) {
      return { success: true, message: 'Usuario logado correctamente', user: results.data, token: results.token }
    }
    console.log(results)
    return { success: false, message: results.message }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error axios:', error.message);
      if (error.response) {
        const results: apiResponse = error.response.data
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