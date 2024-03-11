import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import authRoute from './routes/authRoute'
import userBasicRoute from './routes/userBasicRoute'
import userResourceRoute from './routes/userResourceRoute'
import userProfileRoute from './routes/userProfileRoute'
import userWorkRoute from './routes/userWorkRoute'
import userProjectRoute from './routes/userProjectRoute'
import userSkillRoute from './routes/userSkillRoute'

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
app.use('/user', userBasicRoute)
app.use('/user', userResourceRoute)
app.use('/user', userProfileRoute)
app.use('/user', userWorkRoute)
app.use('/user', userProjectRoute)
app.use('/user', userSkillRoute)

export default app
