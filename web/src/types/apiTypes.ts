export interface registerType {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

export interface loginType {
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

export interface apiResponse {
  success: boolean,
  status: number,
  message: string,
  data?: userType,
  token?: string,
}
