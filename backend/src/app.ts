import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import authRoute from './routes/authRoute'
import userRoute from './routes/userRoute'
import userProfileRoute from './routes/userProfileRoute'
import userWorkRoute from './routes/userWorkRoute'
import userProjectRoute from './routes/userProjectRoute'


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
app.use('/user', userRoute)
app.use('/user', userProfileRoute)
app.use('/user', userWorkRoute)
app.use('/user', userProjectRoute)

export default app
