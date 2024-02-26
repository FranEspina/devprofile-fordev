import app from './app'
import dotenv from 'dotenv'
import { createTables } from './services/db'

dotenv.config()

console.log(process.env.NODE_ENV)

const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`))


createTables()
