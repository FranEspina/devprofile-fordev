import app from './app'
import dotenv from 'dotenv'

dotenv.config()

console.log(process.env.NODE_ENV)

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`))

