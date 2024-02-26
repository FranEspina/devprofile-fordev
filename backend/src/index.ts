import app from './app'
import dotenv from 'dotenv'
import { query } from './services/db'

dotenv.config()

console.log(process.env.NODE_ENV)

const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`))

const buscar = async () => {
  const result = await query('SELECT current_database()', null)
  console.log(result)
}

buscar()
