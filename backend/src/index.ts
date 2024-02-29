import app from './app'
import dotenv from 'dotenv'
import { dropCreateAndSeedTables } from './services/db'

dotenv.config()
console.log(`Entorno: ${process.env.NODE_ENV}`)

if (process.env.DB_MIGRATE) {
  console.log('Iniciando migración de base datos')
  dropCreateAndSeedTables().then(() => {
    console.log('Finalizada migración de base datos')
    process.exit(0)
  })
} else {
  const port = process.env.PORT || 3001
  app.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`))
}
