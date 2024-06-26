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
      DROP TABLE IF EXISTS locations;
      DROP TABLE IF EXISTS basics;
      DROP TABLE IF EXISTS volunteers;
      DROP TABLE IF EXISTS educations;
      DROP TABLE IF EXISTS awards;
      DROP TABLE IF EXISTS certificates;
      DROP TABLE IF EXISTS publications;
      DROP TABLE IF EXISTS skills;
      DROP TABLE IF EXISTS languages;
      DROP TABLE IF EXISTS interests;
      DROP TABLE IF EXISTS user_references;
      DROP TABLE IF EXISTS resources;
      DROP TABLE IF EXISTS sections;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS error_log;
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
        first_name VARCHAR(1000) NOT NULL,
        last_name VARCHAR(1000) NOT NULL,
        email VARCHAR(1000) NOT NULL,
        password VARCHAR(1000) NOT NULL
      )`;

  await pool.query(usersTable)
    .then(() => {
      console.log('- tabla usuarios creada');
    })
    .catch((err) => {
      console.log('Error inesperado creando tabla: usuarios')
      console.log(err);
    });

  const sectionsTable = `
    CREATE TABLE IF NOT EXISTS
      sections(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        section_name VARCHAR(1000) NOT NULL,
        section_id INTEGER NOT NULL,
        is_public BOOLEAN  DEFAULT TRUE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`;

  await pool.query(sectionsTable)
    .then(() => {
      console.log('- tabla configuración secciones creada');
    })
    .catch((err) => {
      console.log('Error inesperado creando tabla: configuración secciones')
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
        title VARCHAR(1000) NOT NULL,
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

  const basicsTable = `
    CREATE TABLE IF NOT EXISTS
      basics(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(1000) NOT NULL,
        label VARCHAR(1000) NOT NULL,
        image VARCHAR(1000) NOT NULL,
        email VARCHAR(1000) NOT NULL, 
        phone VARCHAR(30), 
        url VARCHAR(1000) NOT NULL,
        summary TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      
      CREATE OR REPLACE FUNCTION basics_check_user_id() RETURNS TRIGGER AS $$
      BEGIN
        IF (SELECT COUNT(*) FROM basics WHERE user_id = NEW.user_id) > 0 THEN
            RAISE EXCEPTION 'El usuario ya tiene datos básicos';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE OR REPLACE TRIGGER basics_user_id_trigger_I
      BEFORE INSERT ON basics
      FOR EACH ROW EXECUTE PROCEDURE basics_check_user_id();
      `;

  await pool.query(basicsTable)
    .then(() => {
      console.log('- tabla basics creada');
    })
    .catch((err) => {
      console.log('Error inesperado creando tabla: basics')
      console.log(err);
    });

  const queryTables = `
    CREATE TABLE IF NOT EXISTS
      profiles(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        network VARCHAR(1000) NOT NULL,
        username VARCHAR(1000) NOT NULL,
        url TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      locations(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        address VARCHAR(1000) NOT NULL,
        postal_code VARCHAR(1000) NOT NULL,
        city VARCHAR(1000) NOT NULL,
        country_code VARCHAR(1000) NOT NULL,
        region VARCHAR(1000) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      works(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(1000) NOT NULL,
        location VARCHAR(1000) NOT NULL,
        description TEXT NOT NULL,
        position VARCHAR(1000) NOT NULL,
        url VARCHAR(1000) NOT NULL,
        start_date VARCHAR(10) NOT NULL,
        end_date VARCHAR(10),
        summary TEXT,
        highlights TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      projects(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(1000) NOT NULL,
        description TEXT NOT NULL,
        highlights TEXT,
        keywords TEXT,
        start_date VARCHAR(10) NOT NULL,
        end_date VARCHAR(10),
        url VARCHAR(1000),
        roles TEXT,
        entity VARCHAR(1000),
        type VARCHAR(1000),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      skills(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(1000) NOT NULL,
        level VARCHAR(1000) NOT NULL,
        keywords TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      volunteers(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        organization VARCHAR(1000) NOT NULL,
        position TEXT NOT NULL,
        url VARCHAR(1000),
        start_date VARCHAR(10) NOT NULL,
        end_date VARCHAR(10),
        summary TEXT,
        highlights TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      educations(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        institution VARCHAR(1000) NOT NULL,
        url VARCHAR(1000),
        area VARCHAR(1000) NOT NULL,
        study_type VARCHAR(1000) NOT NULL,
        start_date VARCHAR(10) NOT NULL,
        end_date VARCHAR(10),
        score VARCHAR(1000),
        courses TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      awards(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        title VARCHAR(1000) NOT NULL,
        date VARCHAR(10) NOT NULL,
        awarder VARCHAR(1000),
        summary TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      certificates(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(1000) NOT NULL,
        date VARCHAR(10) NOT NULL,
        url VARCHAR(1000),
        issuer VARCHAR(1000) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      publications(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(1000) NOT NULL,
        publisher VARCHAR(1000) NOT NULL,
        release_date VARCHAR(10) NOT NULL,
        url VARCHAR(1000),
        summary TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      languages(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        language VARCHAR(1000) NOT NULL,
        fluency VARCHAR(1000) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      interests(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(1000) NOT NULL,
        keywords TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

    CREATE TABLE IF NOT EXISTS
      user_references(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(1000) NOT NULL,
        reference TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      `;

  await pool.query(queryTables)
    .then(() => {
      console.log('- tablas de usuarios creadas');
    })
    .catch((err) => {
      console.log('Error inesperado creando tablas de usuarios')
      console.log(err);
    });

  const logTrigger = `
  CREATE TABLE IF NOT EXISTS error_log  (
  error_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  error_message TEXT
  );

  CREATE OR REPLACE FUNCTION log_error(error_text TEXT) RETURNS VOID AS $$
  BEGIN
    INSERT INTO error_log (error_message) VALUES (error_text);
  END;
  $$ LANGUAGE plpgsql;
  `
  await pool.query(logTrigger)
    .then(() => {
      console.log('- Log de triggers creados');
    })
    .catch((err) => {
      console.log('Error inesperado creando log de triggers')
      console.log(err);
    });

  //La tabla 'references' se llama 'user_references' porque 'references' es una palabra protegida 
  const tableNames = ['works', 'profiles', 'locations', 'projects', 'skills', 'volunteers', 'educations', 'awards', 'certificates', 'publications', 'languages', 'interests', 'user_references']
  const triggers = tableNames.map(table => (
    `
    CREATE OR REPLACE FUNCTION delete_public_${table}() RETURNS TRIGGER AS $$
    BEGIN
      DELETE FROM sections WHERE sections.section_name = '${table.replace('user_', '')}' AND sections.section_id = OLD.id;
      RETURN NULL;
    EXCEPTION
      WHEN OTHERS THEN
      PERFORM log_error('Error en delete_public_${table}: ' || SQLERRM);
      RAISE;  
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION insert_public_${table}() RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO sections(section_name, user_id, section_id, is_public)
      VALUES('${table.replace('user_', '')}', NEW.user_id, NEW.id, TRUE);
      RETURN NULL;
    EXCEPTION
      WHEN OTHERS THEN
      PERFORM log_error('Error en delete_public_${table}: ' || SQLERRM);
      RAISE;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER ${table}_trigger_deleted
    AFTER DELETE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE delete_public_${table}();

    CREATE OR REPLACE TRIGGER ${table}_trigger_inserted
    AFTER INSERT ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE insert_public_${table}();
    `
  ))

  await pool.query(triggers.join(''))
    .then(() => {
      console.log('- Creación de Triggers');
    })
    .catch((err) => {
      console.log('Error inesperado creando Triggers')
      console.log(err);
    });

};