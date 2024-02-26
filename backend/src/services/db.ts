import { Pool } from 'pg'

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


