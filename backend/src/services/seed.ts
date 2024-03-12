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

  const sectionsTable = `
    CREATE TABLE IF NOT EXISTS
      sections(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        section_name VARCHAR(50) NOT NULL,
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

  const basicsTable = `
    CREATE TABLE IF NOT EXISTS
      basics(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(50) NOT NULL,
        label VARCHAR(250) NOT NULL,
        image VARCHAR(250) NOT NULL,
        email VARCHAR(100) NOT NULL, 
        phone VARCHAR(30), 
        url VARCHAR(250) NOT NULL,
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

  const triggerSections = `
    CREATE OR REPLACE FUNCTION delete_public_works() RETURNS TRIGGER AS $$
    BEGIN
      DELETE FROM sections WHERE sections.section_name = 'works' AND sections.section_id = OLD.id;
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION insert_public_works() RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO sections(section_name, user_id, section_id, is_public)
      VALUES('works', NEW.user_id, NEW.id, TRUE);
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER works_trigger_deleted
    AFTER DELETE ON works
    FOR EACH ROW
    EXECUTE PROCEDURE delete_public_works();

    CREATE OR REPLACE TRIGGER works_trigger_inserted
    AFTER INSERT ON works
    FOR EACH ROW
    EXECUTE PROCEDURE insert_public_works();

    CREATE OR REPLACE FUNCTION delete_public_profiles() RETURNS TRIGGER AS $$
    BEGIN
      DELETE FROM sections WHERE sections.section_name = 'profiles' AND sections.section_id = OLD.id;
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION insert_public_profiles() RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO sections(section_name, user_id, section_id, is_public)
      VALUES('profiles', NEW.user_id, NEW.id, TRUE);
      RAISE NOTICE 'Se ha insertado una fila en % con los valores: %', TG_TABLE_NAME, NEW;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER profiles_trigger_deleted
    AFTER DELETE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE delete_public_profiles();

    CREATE OR REPLACE TRIGGER profiles_trigger_inserted
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE insert_public_profiles();

    CREATE OR REPLACE FUNCTION delete_public_projects() RETURNS TRIGGER AS $$
    BEGIN
      DELETE FROM sections WHERE sections.section_name = 'projects' AND sections.section_id = OLD.id;
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION insert_public_projects() RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO sections(section_name, user_id, section_id, is_public)
      VALUES('projects', NEW.user_id, NEW.id, TRUE);
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER projects_trigger_deleted
    AFTER DELETE ON projects
    FOR EACH ROW
    EXECUTE PROCEDURE delete_public_projects();

    CREATE OR REPLACE TRIGGER projects_trigger_inserted
    AFTER INSERT ON projects
    FOR EACH ROW
    EXECUTE PROCEDURE insert_public_projects();

    CREATE OR REPLACE FUNCTION delete_public_skills() RETURNS TRIGGER AS $$
    BEGIN
      DELETE FROM sections WHERE sections.section_name = 'skills' AND sections.section_id = OLD.id;
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION insert_public_skills() RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO sections(section_name, user_id, section_id, is_public)
      VALUES('skills', NEW.user_id, NEW.id, TRUE);
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER skills_trigger_deleted
    AFTER DELETE ON skills
    FOR EACH ROW
    EXECUTE PROCEDURE delete_public_skills();

    CREATE OR REPLACE TRIGGER skills_trigger_inserted
    AFTER INSERT ON skills
    FOR EACH ROW
    EXECUTE PROCEDURE insert_public_skills();
      `;

  await pool.query(triggerSections)
    .then(() => {
      console.log('- Triggers basics');
    })
    .catch((err) => {
      console.log('Error inesperado creando Triggers: basics')
      console.log(err);
    });

};