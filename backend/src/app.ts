import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import authRoute from './routes/authRoute'
import devResourceRoute from './routes/devResourceRoute'

const app = express()

const corsOptions = {
  origin: 'http://localhost:4321'
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(morgan('combined'))

app.use('/auth', authRoute)
app.use('/resource', devResourceRoute)

export default app
