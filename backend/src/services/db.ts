import { Pool } from 'pg'
import { User } from '../models/user'

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  ssl: process.env.POSTGRES_SSL === 'true'
});

export function query(text: string, params = null) {
  if (params) {
    return pool.query(text, params)
  }
  return pool.query(text)
}

export const createTables = () => {
  const usersTable = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL
      )`;

  pool.query(usersTable)
    .then(() => {
      console.log('tablas creadas');
    })
    .catch((err) => {
      console.log('Error inesperado creando tablas')
      console.log(err);
    });
};

export const getUserByEmail = async (email: string): Promise<boolean> => {


  try {
    const result = await pool.query('SELECT email FROM users WHERE email = $1', [email])
    if (!result || !result.rowCount) return false
    return (result.rowCount >= 1)
  }
  catch (error) {
    console.log('Error inesperado recuperando usuario por email', error)
    throw error
  }

}

export async function createUser({ email, firstName, lastName, password }: { email: string, firstName: string, lastName: string, password: string }) {
  try {
    const result = await pool.query('INSERT INTO users(EMAIL, FIRST_NAME, LAST_NAME, PASSWORD) VALUES ($1, $2, $3, $4) RETURNING id', [email, firstName, lastName, password])

    return new User({ id: result.rows[0].id, email, firstName, lastName, password })
  }
  catch (error) {
    console.log('Error inesperado creando usuario', error)
    throw error
  }
}