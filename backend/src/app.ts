import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(morgan('combined'))

export default app
