export interface apiRegisterType {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

export interface apiLoginType {
  email: string,
  password: string,
}

export interface apiUserDto {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
}

export interface apiResultType<T> {
  success: boolean,
  message: string,
  data?: T,
  token?: string,
}

export interface apiResponse<T> {
  success: boolean,
  status: number,
  message: string,
  data?: T,
  token?: string,
}
