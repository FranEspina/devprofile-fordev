import { Pool } from 'pg'
import { UserHashPassword, UserDTO, UserCreate } from '../models/user'
import { DevResourceCreate, DevResourceDelete, DevResource } from '../models/modelSchemas'
import { ProfileDelete, Profile } from '../models/modelSchemas'
import { Work } from '../models/modelSchemas'
import { UserDeleteSection } from '../models/modelSchemas'
import { camelToSnakeCase, snakeToCamelCase } from '../services/strings'
//import { QueryResultRow } from 'pg'


const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  ssl: process.env.POSTGRES_SSL === 'true'
});

export const getUserByEmailAsync = async (email: string): Promise<UserHashPassword | null> => {

  try {
    const result = await pool.query('SELECT id, first_name, last_name, password FROM users WHERE email = $1', [email])
    if (!result || !result.rowCount) return null

    return {
      id: result.rows[0]['id'],
      email: email,
      hashPassword: result.rows[0]['password'],
      firstName: result.rows[0]['first_name'],
      lastName: result.rows[0]['last_name']
    }
  }
  catch (error) {
    console.log('Error inesperado recuperando usuario por email', error)
    throw error
  }

}

export const getUserByIdAsync = async (id: number): Promise<UserHashPassword | null> => {

  try {
    const result = await pool.query('SELECT id, first_name, last_name, email, password FROM users WHERE id = $1', [id])
    if (!result || !result.rowCount) return null

    return {
      id: result.rows[0]['id'],
      email: result.rows[0]['email'],
      hashPassword: result.rows[0]['password'],
      firstName: result.rows[0]['first_name'],
      lastName: result.rows[0]['last_name']
    }
  }
  catch (error) {
    console.log('Error inesperado recuperando usuario por id', error)
    throw error
  }

}

export async function createUserAsync({ email, firstName, lastName, hashPassword }: UserCreate): Promise<UserDTO> {
  try {
    const result = await pool.query('INSERT INTO users(EMAIL, FIRST_NAME, LAST_NAME, PASSWORD) VALUES ($1, $2, $3, $4) RETURNING id', [email, firstName, lastName, hashPassword])
    return ({ id: result.rows[0].id, email, firstName, lastName })
  }
  catch (error) {
    console.log('Error inesperado creando usuario', error)
    throw error
  }
}

export async function dbGetResourcesByUserAsync(userId: number): Promise<DevResource[]> {
  const resourcesQuery = 'SELECT id, title, description, type, url, keywords FROM resources WHERE user_id = $1;'
  try {

    const result = await pool.query(resourcesQuery, [userId])
    if (!result || !result.rowCount) {
      return []
    }

    const resources: DevResource[] = result.rows.map((row) => ({
      id: row['id'],
      userId: row['user_id'],
      title: row['title'],
      description: row['description'],
      type: row['type'],
      url: row['url'],
      keywords: row['keywords']
    }))

    return resources
  }
  catch (error) {
    console.log('Error inesperado recuperando recursos', error)
    throw error
  }
}

export async function dbCreateUserResourceAsync(resource: DevResourceCreate): Promise<DevResource> {
  try {

    const { userId, title, description, type, keywords, url } = resource

    const queryParams = [userId, title, description, type, keywords, url]

    const queryResources = `
      INSERT INTO resources(user_id, title, description, type, keywords, url)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id; `
    const result = await pool.query(queryResources, queryParams)

    const resourceSaved: DevResource = {
      id: result.rows[0].id,
      ...resource
    }

    return resourceSaved
  }
  catch (error) {
    console.log('Error inesperado creando recurso de usuario', error)
    throw error
  }
}

export async function dbUpdateUserResourceAsync(resource: DevResource): Promise<DevResource> {
  try {

    const { id, userId, title, description, type, keywords, url } = resource

    const queryParams = [id, userId, title, description, type, keywords, url]

    const queryResources = `
      UPDATE resources 
        SET title = $3, 
            description = $4, 
            type = $5, 
            keywords = $6, 
            url = $7 
      WHERE id = $1 
        AND user_id = $2;`

    await pool.query<DevResource>(queryResources, queryParams)

    return resource

  }
  catch (error) {
    console.log('Error inesperado creando recurso de usuario', error)
    throw error
  }
}

export async function dbDeleteUserResourceAsync({ id, userId }: DevResourceDelete) {
  try {
    const queryParams = [id, userId]
    const queryResources = 'DELETE FROM resources WHERE id = $1 AND user_id = $2;'
    await pool.query(queryResources, queryParams)
  }
  catch (error) {
    console.log('Error inesperado eliminando recurso de usuario', error)
    throw error
  }
}


export async function dbGetProfilesByUserAsync(userId: number): Promise<Profile[]> {
  const profilesQuery = 'SELECT id, user_id, network, username, url FROM profiles WHERE user_id = $1;'
  try {

    const result = await pool.query(profilesQuery, [userId])
    if (!result || !result.rowCount) {
      return []
    }

    const profiles: Profile[] = result.rows.map((row) => ({
      id: row['id'],
      userId: row['user_id'],
      network: row['network'],
      username: row['username'],
      url: row['url'],
    }))

    return profiles
  }
  catch (error) {
    console.log('Error inesperado recuperando perfiles', error)
    throw error
  }
}

export async function dbUpdateUserProfileAsync(profile: Profile): Promise<Profile> {
  try {

    const { id, userId, network, username, url } = profile

    const queryParams = [id, userId, network, username, url]

    const queryProfiles = `
      UPDATE profiles 
        SET network = $3, 
            username = $4, 
            url = $5 
      WHERE id = $1 
        AND user_id = $2;`

    await pool.query<Profile>(queryProfiles, queryParams)

    return profile

  }
  catch (error) {
    console.log('Error inesperado creando perfil de usuario', error)
    throw error
  }
}

export async function dbDeleteUserProfileAsync({ id, userId }: ProfileDelete) {
  try {
    const queryParams = [id, userId]
    const queryResources = 'DELETE FROM profiles WHERE id = $1 AND user_id = $2;'
    await pool.query(queryResources, queryParams)
  }
  catch (error) {
    console.log('Error inesperado eliminando recurso de usuario', error)
    throw error
  }
}

export async function dbGetWorksByUserAsync(userId: number): Promise<Work[]> {
  const profilesQuery = 'SELECT id, user_id, title, position, description, start_date, end_date FROM works WHERE user_id = $1;'
  try {

    const result = await pool.query(profilesQuery, [userId])
    if (!result || !result.rowCount) {
      return []
    }

    const works: Work[] = result.rows.map((row) => ({
      id: row['id'],
      userId: row['user_id'],
      title: row['title'],
      position: row['position'],
      description: row['description'],
      startDate: row['start_date'],
      endDate: row['end_date'],
    }))

    return works
  }
  catch (error) {
    console.log('Error inesperado recuperando puestos de trabajo', error)
    throw error
  }
}

export async function dbDeleteUserSectionAsync(userSection: UserDeleteSection) {
  try {
    const queryParams = [userSection.id, userSection.userId]
    const queryResources = `DELETE FROM ${userSection.tablename} WHERE id = $1 AND user_id = $2;`
    await pool.query(queryResources, queryParams)
  }
  catch (error) {
    console.log(`Error inesperado eliminando sección: ${userSection.tablename}`, error)
    throw error
  }
}

export async function dbUpdateUserSectionAsync<T>(tablename: string, model: T): Promise<number | null> {
  try {

    const queryParams = []
    const setClause: string[] = []
    const whereClause: string[] = []
    let index = 1

    for (const fieldName in model) {
      if (fieldName === 'id' || fieldName === 'userId') {
        whereClause.push(`${camelToSnakeCase(fieldName)} = $${index}`)
      } else {
        setClause.push(`${camelToSnakeCase(fieldName)} = $${index}`)
      }
      queryParams.push(model[fieldName])
      index++
    }

    const updateQuery = `UPDATE ${tablename} SET ${setClause.join(', ')} WHERE ${whereClause.join(' AND ')}`
    const updated = await pool.query(updateQuery, queryParams)

    if (updated.rowCount === 0) {
      console.log('Actualización de modelo que no existe')
      console.log(updated)
      console.log(updateQuery)
      console.log(queryParams)
    }

    return updated.rowCount

  }
  catch (error) {
    console.log('Error inesperado actualizando de usuario', error)
    throw error
  }
}

export async function dbCreateUserSectionAsync<T>(tablename: string, model: T): Promise<number> {
  try {

    const queryParams = []
    const fieldsClause: string[] = []
    const valuesClause: string[] = []
    let index = 1

    for (const fieldName in model) {

      fieldsClause.push(`${camelToSnakeCase(fieldName)}`)
      valuesClause.push(`$${index}${(model[fieldName] instanceof Date) ? '::timestamptz' : ''}`)
      queryParams.push(model[fieldName])
      index++
    }

    const queryInsert = `
      INSERT INTO ${tablename}(${fieldsClause.join(', ')})
      VALUES (${valuesClause.join(', ')}) RETURNING id; `
    const result = await pool.query(queryInsert, queryParams)

    return result.rows[0].id

  }
  catch (error) {
    console.log('Error inesperado creando puesto de trabajo de usuario', error)
    throw error
  }
}


function updateObject<T>(obj: T, key: keyof T, value: unknown): T {
  return { ...obj, [key]: value };
}

export async function dbGetUserSectionByUserAsync<T extends { [key: string]: unknown }>(tablename: string, userId: number): Promise<T[]> {
  const userSectionQuery = `SELECT * FROM ${tablename} WHERE user_id = $1 order by id asc;`
  try {

    //TODO: Crear todos los modelos tanto de BBDD como de los DTO de la API
    //No queremos tener dos clases, una para los controladores (camelCase) y otra para la bbdd (snake_case)
    //const result = await pool.query<T>(userSectionQuery, [userId])
    const result = await pool.query(userSectionQuery, [userId])
    if (!result || !result.rowCount) {
      return []
    }

    //TODO eliminar cuando existan los modelos
    const sections: T[] = []
    for (let indexRow = 0; indexRow < result.rows.length; indexRow++) {
      const row = result.rows[indexRow]
      let section: T = {} as T

      for (let index = 0; index < result.fields.length; index++) {
        const field = result.fields[index];
        const name: string = field['name']
        section = updateObject(section, snakeToCamelCase(name), row[name])
      }
      sections.push(section)
    }
    return sections
  }
  catch (error) {
    console.log(`Error inesperado recuperando sección de usuario: '${tablename}'`, error)
    throw error
  }
}