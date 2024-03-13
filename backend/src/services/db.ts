import { Pool } from 'pg'
import { UserHashPassword, UserDTO, UserCreate } from '../models/user'
import { UserDeleteSection, SectionData } from '../models/modelSchemas'
import { camelToSnakeCase, snakeToCamelCase } from '../services/strings'

import { WorkResume, ProjectResume, SkillResume, ProfileResume, Basic, BasicResume } from '../models/modelSchemas'


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

    console.log(queryInsert)
    console.log(queryParams)

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

  const userSectionQuery = `
  SELECT sections.id, sections.user_id, sections.section_name, sections.section_id, sections.is_public,
    CASE sections.section_name 
      WHEN 'works' THEN works.title
      WHEN 'profiles' THEN profiles.network
      WHEN 'projects' THEN projects.name
      WHEN 'skills' THEN skills.name
      ELSE '#SECCIÓN DESCONOCIDA'
    END section_desc, 
    CASE sections.section_name
      WHEN 'works' THEN 'Puesto'
      WHEN 'profiles' THEN 'Perfil'
      WHEN 'projects' THEN 'Proyecto'
      WHEN 'skills' THEN 'Competencia'
      ELSE '#SECCIÓN DESCONOCIDA'
    END section_full_name
 FROM sections 
    left join works on (sections.section_name = 'works' and works.user_id = $1 and works.id = sections.section_id)
    left join profiles on (sections.section_name = 'profiles' and profiles.user_id = $1 and profiles.id = sections.section_id)
    left join projects on (sections.section_name = 'projects' and projects.user_id = $1 and projects.id = sections.section_id)
    left join skills on (sections.section_name = 'skills' and skills.user_id = $1 and skills.id = sections.section_id)
  WHERE sections.user_id = $1 order by sections.section_name asc, sections.section_id asc;
`
  try {
    const sections: SectionData[] = []

    console.log(userSectionQuery)

    //TODO: Crear todos los modelos tanto de BBDD como de los DTO de la API
    //No queremos tener dos clases, una para los controladores (camelCase) y otra para la bbdd (snake_case)
    //const result = await pool.query<T>(userSectionQuery, [userId])
    const result = await pool.query(userSectionQuery, [userId])
    if (!result || !result.rowCount) {
      return sections
    }

    console.log(result)

    //TODO eliminar cuando existan los modelos
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

export async function dbGetUserResumeAsync(userId: number): Promise<{ [key: string]: unknown }> {

  const resume: { [key: string]: unknown } = {}
  resume['$schema'] = 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json'

  try {

    const basic = await dbGetUserSectionByUserAsync<Basic>('basics', userId)
    if (basic && basic.length !== 0) {
      const { id, userId, ...basicFields } = basic[0]
      const basicResume: { [key: string]: unknown } = { ...basicFields }
      const profile = await dbGetUserSectionResumeAsync<ProfileResume>('profiles', userId)
      if (profile) {
        if (profile && profile.length !== 0) {
          basicResume['profiles'] = profile
        }
      }
      resume['basic'] = basicResume
    }

    const work = await dbGetUserSectionResumeAsync<WorkResume>('works', userId)
    if (work && work.length !== 0) {
      resume['work'] = work
    }

    // const volunteer = await dbGetUserSectionResumeAsync<VolunteerResume>('volunteers', userId)
    // if (volunteer && volunteer.length !== 0) {
    //   resume['volunteer'] = volunteer
    // }

    // const education = await dbGetUserSectionResumeAsync<EducationResume>('educations', userId)
    // if (education && education.length !== 0) {
    //   resume['education'] = education
    // }

    // const awards = await dbGetUserSectionResumeAsync<AwardResume>('awards', userId)
    // if (awards && awards.length !== 0) {
    //   resume['awards'] = awards
    // }

    // const publications = await dbGetUserSectionResumeAsync<PublicationResume>('publications', userId)
    // if (publications && publications.length !== 0) {
    //   resume['publications'] = publications
    // }

    // const certificates = await dbGetUserSectionResumeAsync<CertificateResume>('certificates', userId)
    // if (certificates && certificates.length !== 0) {
    //   resume['certificates'] = certificates
    // }

    const skills = await dbGetUserSectionResumeAsync<SkillResume>('skills', userId)
    if (skills && work.length !== 0) {
      resume['skills'] = skills
    }

    // const languages = await dbGetUserSectionResumeAsync<LanguageResume>('languages', userId)
    // if (languages && languages.length !== 0) {
    //   resume['languages'] = languages
    // }

    // const interests = await dbGetUserSectionResumeAsync<InterestResume>('interests', userId)
    // if (interests && interests.length !== 0) {
    //   resume['interests'] = interests
    // }

    // const references = await dbGetUserSectionResumeAsync<ReferenceResume>('references', userId)
    // if (references && references.length !== 0) {
    //   resume['references'] = references
    // }

    const projects = await dbGetUserSectionResumeAsync<ProjectResume>('projects', userId)
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

export async function dbGetUserSectionResumeAsync<T>(tablename: string, userId: number): Promise<T[]> {

  const resume: { [key: string]: unknown } = {}

  const query = `
  SELECT ${tablename}.*
  FROM ${tablename} 
    inner join sections on (sections.section_name = '${tablename}' 
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
          if (name !== 'id' && name !== 'user_id') {
            const camelCaseName = snakeToCamelCase(name) as keyof T
            model = updateObject<T>(model, camelCaseName, row[name])
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