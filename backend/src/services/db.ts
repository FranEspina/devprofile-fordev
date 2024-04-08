import { Pool, QueryResult } from 'pg'
import { UserHashPassword, UserDTO, UserCreate } from '../models/user'
import { UserDeleteSection, SectionData } from '../models/modelSchemas'
import { camelToSnakeCase, snakeToCamelCase } from '../services/strings'
import { type JSonResume } from '../schemas/jsonSchema'

import { Work, Project, Skill, Profile, Basic, Location, Volunteer, Education, Award, Certificate, Publication, Language, Interest, Reference } from '../models/modelSchemas'

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  ssl: process.env.POSTGRES_SSL === 'true'
});

const BASIC_SECTION_FIELDS = { section: 'basics', table: 'basics', schema: 'basic', field: '', description: 'Datos básicos' }
const SECTION_FIELDS = [
  { section: 'works', table: 'works', schema: 'work', field: 'name', description: 'Puesto' },
  { section: 'profiles', table: 'profiles', schema: 'profiles', field: 'network', description: 'Perfil' },
  { section: 'projects', table: 'projects', schema: 'projects', field: 'name', description: 'Proyecto' },
  { section: 'skills', table: 'skills', schema: 'skills', field: 'name', description: 'Competencia' },
  { section: 'locations', table: 'locations', schema: 'location', field: 'address', description: 'Dirección' },
  { section: 'volunteers', table: 'volunteers', schema: 'volunteer', field: 'organization', description: 'Voluntariado' },
  { section: 'educations', table: 'educations', schema: 'education', field: 'institution', description: 'Estudio' },
  { section: 'awards', table: 'awards', schema: 'awards', field: 'title', description: 'Logro' },
  { section: 'certificates', table: 'certificates', schema: 'certificates', field: 'name', description: 'Certificado' },
  { section: 'publications', table: 'publications', schema: 'publications', field: 'name', description: 'Publicación' },
  { section: 'languages', table: 'languages', schema: 'languages', field: 'language', description: 'Idioma' },
  { section: 'interests', table: 'interests', schema: 'interests', field: 'name', description: 'Interés' },
  { section: 'references', table: 'user_references', schema: 'references', field: 'name', description: 'Referencia' },
]

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

interface sectionQuery<T> {
  query: string,
  params: (string | T[Extract<keyof T, string>])[]
}

function getUserSectionQuery<T>(tablename: string, model: T): sectionQuery<T> {
  try {

    const params = []
    const fieldsClause: string[] = []
    const valuesClause: string[] = []
    let index = 1

    for (const fieldName in model) {
      fieldsClause.push(`${camelToSnakeCase(fieldName)}`)
      valuesClause.push(`$${index}${(model[fieldName] instanceof Date) ? '::timestamptz' : ''}`)
      if (Array.isArray(model[fieldName])) {
        params.push(JSON.stringify(model[fieldName]) ?? '')
      } else {
        params.push(model[fieldName])
      }
      index++
    }

    const query = `
      INSERT INTO ${tablename}(${fieldsClause.join(', ')})
      VALUES (${valuesClause.join(', ')}) RETURNING id; `

    return { query, params }
  }
  catch (error) {
    console.log('Error inesperado creando puesto de trabajo de usuario', error)
    throw error
  }
}


export async function dbCreateUserSectionAsync<T>(tablename: string, model: T): Promise<number> {

  try {
    const { query, params } = getUserSectionQuery<T>(tablename, model)
    const result = await pool.query(query, params)
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

export async function dbGetUserSectionDataAsync(userId: number): Promise<SectionData[]> {

  const casesField = SECTION_FIELDS.map(f => `WHEN '${f.section}' THEN ${f.table}.${f.field}`).join('\r\n')
  const casesDescription = SECTION_FIELDS.map(f => `WHEN '${f.section}' THEN '${f.description}'`).join('\r\n')
  const leftJoins = SECTION_FIELDS.map(f => `left join ${f.table} on (sections.section_name = '${f.section}' and ${f.table}.user_id = $1 and ${f.table}.id = sections.section_id)`).join('\r\n')

  //TODO: pasar a un array las secciones y realizar con un bucle forEach
  const userSectionQuery = `
    SELECT sections.id, sections.user_id, sections.section_name, sections.section_id, sections.is_public,
      CASE sections.section_name 
        ${casesField}
        ELSE '#SECCIÓN DESCONOCIDA'
      END section_desc, 
      CASE sections.section_name
        ${casesDescription}
        ELSE '#SECCIÓN DESCONOCIDA'
      END section_full_name
    FROM sections 
      ${leftJoins}
    WHERE sections.user_id = $1 order by sections.section_name asc, sections.section_id asc;
  `
    ;
  try {
    const sections: SectionData[] = []


    //TODO: Crear todos los modelos tanto de BBDD como de los DTO de la API
    //No queremos tener dos clases, una para los controladores (camelCase) y otra para la bbdd (snake_case)
    //const result = await pool.query<T>(userSectionQuery, [userId])
    const result = await pool.query(userSectionQuery, [userId])
    if (!result || !result.rowCount) {
      return sections
    }
    for (let indexRow = 0; indexRow < result.rows.length; indexRow++) {
      const row = result.rows[indexRow]

      let section: SectionData = {} as SectionData
      for (let index = 0; index < result.fields.length; index++) {
        const field = result.fields[index];
        const name: string = field['name']
        const camelCaseName = snakeToCamelCase(name) as keyof SectionData
        section = updateObject<SectionData>(section, camelCaseName, row[name])
      }
      sections.push(section)
    }
    return sections
  }
  catch (error) {
    console.log('Error inesperado recuperando secciones de usuario', error)
    throw error
  }
}

export async function dbGetUserBasicResumeAsync({ userId, includeIds, arrayParsed }: { userId: number, includeIds: boolean, arrayParsed: boolean }): Promise<{ [key: string]: unknown }[]> {

  let basicResume: { [key: string]: unknown } = {}

  try {

    const basic = await dbGetUserSectionByUserAsync<Basic>('basics', userId)
    if (basic && basic.length !== 0) {
      if (includeIds) {
        basicResume = basic[0]
      }
      else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, userId: __, ...basicFields } = basic[0]
        basicResume = { ...basicFields }
      }
      const profile = await dbGetUserSectionResumeAsync<Profile>({ tablename: 'profiles', userId, includeIds, arrayParsed })
      if (profile) {
        if (profile && profile.length !== 0) {
          basicResume['profiles'] = profile
        }
      }
      const location = await dbGetUserSectionResumeAsync<Location>({ tablename: 'locations', userId, includeIds, arrayParsed })
      if (location) {
        if (location && location.length !== 0) {
          basicResume['location'] = location[0]
        }
      }
    }

    return [basicResume]
  }
  catch (error) {
    console.log('Error inesperado recuperando datos básicos de usuario', error)
    throw error
  }
}

export async function dbGetUserResumeAsync({ userId, includeIds, arrayParsed }: { userId: number, includeIds: boolean, arrayParsed: boolean }): Promise<{ [key: string]: unknown }> {
  const resume: { [key: string]: unknown } = {}
  resume['$schema'] = 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json'

  try {

    const basic = await dbGetUserSectionByUserAsync<Basic>('basics', userId)
    if (basic && basic.length !== 0) {

      let basicResume: { [key: string]: unknown }
      if (includeIds) {
        basicResume = basic[0]
      }
      else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, userId: __, ...basicFields } = basic[0]
        basicResume = { ...basicFields }
      }

      const profile = await dbGetUserSectionResumeAsync<Profile>({ tablename: 'profiles', userId, includeIds, arrayParsed })
      if (profile) {
        if (profile && profile.length !== 0) {
          basicResume['profiles'] = profile
        }
      }
      const location = await dbGetUserSectionResumeAsync<Location>({ tablename: 'locations', userId, includeIds, arrayParsed })
      if (location) {
        if (location && location.length !== 0) {
          basicResume['location'] = location[0]
        }
      }
      resume['basics'] = basicResume
    }

    const work = await dbGetUserSectionResumeAsync<Work>({ tablename: 'works', userId, includeIds, arrayParsed })
    if (work && work.length !== 0) {
      resume['work'] = work
    }

    const volunteer = await dbGetUserSectionResumeAsync<Volunteer>({ tablename: 'volunteers', userId, includeIds, arrayParsed })
    if (volunteer && volunteer.length !== 0) {
      resume['volunteer'] = volunteer
    }

    const education = await dbGetUserSectionResumeAsync<Education>({ tablename: 'educations', userId, includeIds, arrayParsed })
    if (education && education.length !== 0) {
      resume['education'] = education
    }

    const awards = await dbGetUserSectionResumeAsync<Award>({ tablename: 'awards', userId, includeIds, arrayParsed })
    if (awards && awards.length !== 0) {
      resume['awards'] = awards
    }

    const publications = await dbGetUserSectionResumeAsync<Publication>({ tablename: 'publications', userId, includeIds, arrayParsed })
    if (publications && publications.length !== 0) {
      resume['publications'] = publications
    }

    const certificates = await dbGetUserSectionResumeAsync<Certificate>({ tablename: 'certificates', userId, includeIds, arrayParsed })
    if (certificates && certificates.length !== 0) {
      resume['certificates'] = certificates
    }

    const skills = await dbGetUserSectionResumeAsync<Skill>({ tablename: 'skills', userId, includeIds, arrayParsed })
    if (skills && work.length !== 0) {
      resume['skills'] = skills
    }

    const languages = await dbGetUserSectionResumeAsync<Language>({ tablename: 'languages', userId, includeIds, arrayParsed })
    if (languages && languages.length !== 0) {
      resume['languages'] = languages
    }

    const interests = await dbGetUserSectionResumeAsync<Interest>({ tablename: 'interests', userId, includeIds, arrayParsed })
    if (interests && interests.length !== 0) {
      resume['interests'] = interests
    }

    const references = await dbGetUserSectionResumeAsync<Reference>({ tablename: 'user_references', userId, includeIds, arrayParsed })
    if (references && references.length !== 0) {
      resume['references'] = references
    }

    const projects = await dbGetUserSectionResumeAsync<Project>({ tablename: 'projects', userId, includeIds, arrayParsed })
    if (projects && projects.length !== 0) {
      resume['projects'] = projects
    }

    resume['meta'] = {
      'version': 'v1.0.0',
      'canonical': 'https://github.com/jsonresume/resume-schema/blob/v1.0.0/schema.json'
    }

    return resume
  }
  catch (error) {
    console.log('Error inesperado recuperando secciones de usuario', error)
    throw error
  }
}

export async function dbGetUserSectionResumeAsync<T>({ tablename, userId, includeIds, arrayParsed }: { tablename: string, userId: number, includeIds: boolean, arrayParsed: boolean }): Promise<T[]> {

  const resume: { [key: string]: unknown } = {}

  const query = `
  SELECT ${tablename}.*
  FROM ${tablename} 
    inner join sections on (sections.section_name = '${tablename.replace('user_', '')}' 
                        and sections.section_id = ${tablename}.id
                        and sections.user_id = $1 
                        and sections.is_public = true)
  WHERE sections.user_id = $1 
  order by ${tablename}.id asc;
`

  try {
    const sections: T[] = []
    resume[tablename] = sections
    const result = await pool.query(query, [userId])
    if (result && result.rowCount) {
      for (let indexRow = 0; indexRow < result.rows.length; indexRow++) {
        const row = result.rows[indexRow]
        let model: T = {} as T
        for (let index = 0; index < result.fields.length; index++) {
          const field = result.fields[index];
          const name: string = field['name']
          if (includeIds || (name !== 'id' && name !== 'user_id')) {
            let value = row[name]
            if (validateOptionalFields(tablename, name, value)) {
              if (arrayParsed && isArrayField(tablename, name)) {
                value = JSON.parse(value)
              }
              const camelCaseName = snakeToCamelCase(name) as keyof T
              model = updateObject<T>(model, camelCaseName, value)
            }
          }
        }
        sections.push(model)
      }
    }
    return sections
  }
  catch (error) {
    console.log('Error inesperado recuperando secciones de usuario', error)
    throw error
  }

}

function isArrayField(tablename: string, fieldname: string) {
  if (tablename === 'works' && fieldname === 'highlights') {
    return true
  } else if (tablename === 'volunteers' && fieldname === 'highlights') {
    return true
  } else if (tablename === 'educations' && fieldname === 'courses') {
    return true
  } else if (tablename === 'skills' && fieldname === 'keywords') {
    return true
  } else if (tablename === 'interests' && fieldname === 'keywords') {
    return true
  } else if (tablename === 'projects' && fieldname === 'keywords') {
    return true
  } else if (tablename === 'projects' && fieldname === 'roles') {
    return true
  } else if (tablename === 'projects' && fieldname === 'highlights') {
    return true
  }
  return false
}

function validateOptionalFields(tablename: string, fieldname: string, value: unknown) {
  let isRequired = true

  if (tablename === 'basics' && (
    fieldname === 'phone' ||
    fieldname === 'summary')) {
    isRequired = false
  } else if (tablename === 'works' && (
    fieldname === 'end_date' ||
    fieldname === 'summary' ||
    fieldname === 'highlights')) {
    isRequired = false
  } else if (tablename === 'projects' && (
    fieldname === 'highlights' ||
    fieldname === 'keywords' ||
    fieldname === 'end_date' ||
    fieldname === 'roles' ||
    fieldname === 'entity' ||
    fieldname === 'type')) {
    isRequired = false
  } else if (tablename === 'skills' && (
    fieldname === 'keywords')) {
    isRequired = false
  } else if (tablename === 'volunteers' && (
    fieldname === 'url' ||
    fieldname === 'end_date' ||
    fieldname === 'summary' ||
    fieldname === 'highlights')) {
    isRequired = false
  } else if (tablename === 'educations' && (
    fieldname === 'url' ||
    fieldname === 'end_date' ||
    fieldname === 'score' ||
    fieldname === 'courses')) {
    isRequired = false
  } else if (tablename === 'awards' && (
    fieldname === 'awarder' ||
    fieldname === 'summary')) {
    isRequired = false
  } else if (tablename === 'certificates' && (
    fieldname === 'url')) {
    isRequired = false
  } else if (tablename === 'publications' && (
    fieldname === 'url' ||
    fieldname === 'summary')) {
    isRequired = false
  } else if (tablename === 'interests' && (
    fieldname === 'keywords')) {
    isRequired = false
  }

  if (isRequired)
    return true

  return value ? true : false

}

function addUserInfoToModel(userId: number, model: { [key: string]: string }) {
  return {
    ...model,
    userId: userId
  }
}

function getDeleteAllUserSectionQuery(userId: number, tablename: string) {
  try {
    const params = [userId]
    const query = `DELETE FROM ${tablename} WHERE user_id = $1;`
    return { query, params }
  }
  catch (error) {
    console.log(`Error inesperado eliminando sección completa: ${tablename}`, error)
    throw error
  }
}

export async function dbImportUserResumeAsync({ userId, resume }: { userId: number, resume: JSonResume }): Promise<void> {
  let transactionOpen = false
  const client = await pool.connect()
  try {

    await client.query('BEGIN')
    transactionOpen = true

    const promises: Promise<QueryResult>[] = []

    const basics = resume.basics

    if (basics) {

      const { location, profiles, ...basic } = basics

      if (basic) {

        const { query: queryDelete, params: paramsDelete } = getDeleteAllUserSectionQuery(userId, 'basics');
        const promiseDelete = client.query(queryDelete, paramsDelete)
        promises.push(promiseDelete)

        const { query, params } = getUserSectionQuery('basics', addUserInfoToModel(userId, basic))
        const promise = client.query(query, params)
        promises.push(promise)
      }

      if (location) {
        const { query, params } = getUserSectionQuery('locations', addUserInfoToModel(userId, location))
        const promise = client.query(query, params)
        promises.push(promise)
      }

      if (profiles) {
        profiles.forEach(profile => {
          const { query, params } = getUserSectionQuery('profiles', addUserInfoToModel(userId, profile))
          const promise = client.query(query, params)
          promises.push(promise)
        })
      }
    }

    SECTION_FIELDS.filter(s => s.schema !== 'basics' && s.schema !== 'location' && s.schema !== 'profiles')
      .forEach(resumeSection => {
        const sectionSchema = resumeSection.schema as keyof JSonResume
        if (resume[sectionSchema]) {
          (resume[sectionSchema] as []).forEach(model => {
            const { query, params } = getUserSectionQuery(resumeSection.table, addUserInfoToModel(userId, model))
            const promise = client.query(query, params)
            promises.push(promise)
          });
        }
      })

    for (const promise of promises) {
      const tipada: Promise<QueryResult> = promise
      try {
        await tipada;
      } catch (error) {
        console.log('errores', error);
        throw error;  // Lanza el error para que pueda ser capturado por el bloque catch de la transacción
      }
    }
    await client.query('COMMIT');
  }
  catch (error) {
    if (transactionOpen) {
      await client.query('ROLLBACK');
    }
    console.log('Error inesperado importando resumen del usuario', error)
    throw error

  } finally {
    client.release();
  }
}



export async function dbDeleteResumeWithPoolAsync(userId: number): Promise<void> {
  let transactionOpen = false
  const client = await pool.connect()
  try {

    await client.query('BEGIN')
    transactionOpen = true

    const DeleteSections = structuredClone(SECTION_FIELDS)
    DeleteSections.push(structuredClone(BASIC_SECTION_FIELDS))

    const promises = DeleteSections.map(resumeSection => {
      const { query, params } = getDeleteAllUserSectionQuery(userId, resumeSection.table);
      return client.query(query, params)
    });

    for (const promise in promises) {
      try {
        await promise;
      } catch (error) {
        console.log('errores', error);
        throw error;  // Lanza el error para que pueda ser capturado por el bloque catch de la transacción
      }
    }
    await client.query('COMMIT');
  }
  catch (error) {
    if (transactionOpen) {
      await client.query('ROLLBACK');
    }
    console.log('Error inesperado eliminando resumen del usuario', error)
    throw error
  }
  finally {
    client.release()
  }

}
