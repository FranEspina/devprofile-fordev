import { hashAsync } from './cryptService'
import { Pool } from 'pg'

export const dropCreateAndSeedTables = async () => {

  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    ssl: process.env.POSTGRES_SSL === 'true'
  });

  if (process.env.DB_MIGRATE_DROP_TABLES === 'true') {
    console.log('- Configuración de Eliminación de tablas activada ');
    const dropTables = `
      DROP TABLE IF EXISTS skills;
      DROP TABLE IF EXISTS projects;
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
  } else {
    console.log('- Configuración de Eliminación de tablas NO activada ');
  }

  const setTimeZoneQuery = `
    SET TIME ZONE 'Europe/Madrid';
  `
  await pool.query(setTimeZoneQuery)
    .then(() => {
      console.log('- Establecida zona horaria \'Europe/Madrid\'');
    })
    .catch((err) => {
      console.log('Error estableciendo zona horaria')
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
        start_date TIMESTAMPTZ NOT NULL,
        end_date TIMESTAMPTZ,
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

  const projectsTable = `
    CREATE TABLE IF NOT EXISTS
      projects(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        highlights TEXT,
        keywords TEXT,
        start_date TIMESTAMPTZ NOT NULL,
        end_date TIMESTAMPTZ,
        url VARCHAR(250) NOT NULL,
        roles TEXT,
        entity VARCHAR(250),
        type VARCHAR(250),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`;

  await pool.query(projectsTable)
    .then(() => {
      console.log('- tabla projects creada');
    })
    .catch((err) => {
      console.log('Error inesperado creando tabla: projects')
      console.log(err);
    });

  const skillsTable = `
    CREATE TABLE IF NOT EXISTS
      skills(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(50) NOT NULL,
        level VARCHAR(50) NOT NULL,
        keywords TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`;

  await pool.query(skillsTable)
    .then(() => {
      console.log('- tabla skills creada');
    })
    .catch((err) => {
      console.log('Error inesperado creando tabla: skills')
      console.log(err);
    });
};