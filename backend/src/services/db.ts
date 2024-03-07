import { Pool } from 'pg'
import { UserHashPassword, UserDTO, UserCreate } from '../models/user'
import { DevResourceCreate, DevResourceDelete, DevResource } from '../models/modelSchemas'
import { ProfileCreate, ProfileDelete, Profile } from '../models/modelSchemas'
import { WorkCreate, WorkDelete, Work } from '../models/modelSchemas'

import { hashAsync } from './cryptService'

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  ssl: process.env.POSTGRES_SSL === 'true'
});

export const dropCreateAndSeedTables = async () => {


  const dropTables = `
    DROP TABLE IF EXISTS works;
    DROP TABLE IF EXISTS profiles;
    DROP TABLE IF EXISTS resources;
    DROP TABLE IF EXISTS users;
  `
  await pool.query(dropTables)
    .then(() => {
      console.log('- ELiminadas todas las tablas');
    })
    .catch((err) => {
      console.log('Error inesperado eliminando tablas')
      console.log(err);
    });

  const usersTable = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL
      )`;

  await pool.query(usersTable)
    .then(() => {
      console.log('- tabla usuarios creada');
    })
    .catch((err) => {
      console.log('Error inesperado creando tabla: usuarios')
      console.log(err);
    });

  //Usuario por defecto en entorno de desarrollo  
  if (process.env.NODE_ENV === 'development') {
    const defaultUser = 'admin'
    const defaultPassword = defaultUser
    const defaultHashPassword = await hashAsync(defaultPassword)
    const seedUserQuery = 'INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4)'

    await pool.query(seedUserQuery, [defaultUser, defaultUser, `${defaultUser}@correo.com`, defaultHashPassword])
      .then(() => {
        console.log(`- Generado usuario por defecto: ${defaultUser}@correo.com:${defaultPassword}`);
      })
      .catch((err) => {
        console.log('Error inesperado creando usuario genérico')
        console.log(err);
      });
  }

  const resourcesTable = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resourcetype') THEN
            CREATE TYPE resourceType AS ENUM ('markdown', 'imagen', 'web', 'archivo');
        END IF;
    END
    $$ LANGUAGE plpgsql;
    CREATE TABLE IF NOT EXISTS
      resources(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        title VARCHAR(128) NOT NULL,
        description TEXT NOT NULL,
        type resourceType NOT NULL,
        keywords TEXT, 
        url TEXT, 
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`;

  await pool.query(resourcesTable)
    .then(() => {
      console.log('- tabla recursos creada');
    })
    .catch((err) => {
      console.log('Error inesperado creando tabla: recursos')
      console.log(err);
    });

  const profilesTable = `
    CREATE TABLE IF NOT EXISTS
      profiles(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        network VARCHAR(50) NOT NULL,
        username VARCHAR(50) NOT NULL,
        url TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`;

  await pool.query(profilesTable)
    .then(() => {
      console.log('- tabla perfiles creada');
    })
    .catch((err) => {
      console.log('Error inesperado creando tabla: perfiles')
      console.log(err);
    });

  const worksTable = `
    CREATE TABLE IF NOT EXISTS
      works(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        title VARCHAR(50) NOT NULL,
        position VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        start_date DATE NOT NULL, 
        end_date DATE, 
        highlights TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`;

  await pool.query(worksTable)
    .then(() => {
      console.log('- tabla works creada');
    })
    .catch((err) => {
      console.log('Error inesperado creando tabla: works')
      console.log(err);
    });

};

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

export async function dbCreateUserProfileAsync(profile: ProfileCreate): Promise<Profile> {
  try {

    const { userId, network, username, url } = profile

    const queryParams = [userId, network, username, url]

    const queryResources = `
      INSERT INTO profiles(user_id, network, username, url)
      VALUES ($1, $2, $3, $4) RETURNING id; `
    const result = await pool.query(queryResources, queryParams)

    const profileSaved: Profile = {
      id: result.rows[0].id,
      ...profile
    }

    return profileSaved
  }
  catch (error) {
    console.log('Error inesperado creando perfil de usuario', error)
    throw error
  }
}

export async function dbGetProfilesByUserAsync(userId: number): Promise<Profile[]> {
  const profilesQuery = 'SELECT id, network, username, url FROM profiles WHERE user_id = $1;'
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

export async function dbCreateUserWorkAsync(work: WorkCreate): Promise<Work> {
  try {

    const { userId, title, position, description, startDate, endDate } = work

    const queryParams = [userId, title, position, description, startDate, endDate]

    const queryResources = `
      INSERT INTO works(user_id, title, position, description, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id; `
    const result = await pool.query(queryResources, queryParams)

    const workSaved: Work = {
      id: result.rows[0].id,
      ...work
    }

    return workSaved
  }
  catch (error) {
    console.log('Error inesperado creando puesto de trabajo de usuario', error)
    throw error
  }
}

export async function dbGetWorksByUserAsync(userId: number): Promise<Work[]> {
  const profilesQuery = 'SELECT id, title, position, description, start_date, end_date FROM works WHERE user_id = $1;'
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

export async function dbUpdateUserWorkAsync(work: Work): Promise<Work> {
  try {

    const { id, userId, title, position, description, startDate, endDate } = work

    const queryParams = [id, userId, title, position, description, startDate, endDate]

    const queryWorks = `
      UPDATE works 
        SET title = $3, 
            position = $4, 
            description = $5, 
            start_date = $6,
            end_date = $7
      WHERE id = $1 
        AND user_id = $2;`

    await pool.query<Work>(queryWorks, queryParams)

    return work

  }
  catch (error) {
    console.log('Error inesperado creando perfil de usuario', error)
    throw error
  }
}

export async function dbDeleteUserWorkAsync({ id, userId }: WorkDelete) {
  try {
    const queryParams = [id, userId]
    const queryResources = 'DELETE FROM works WHERE id = $1 AND user_id = $2;'
    await pool.query(queryResources, queryParams)
  }
  catch (error) {
    console.log('Error inesperado eliminando puesto de trabajo', error)
    throw error
  }
}