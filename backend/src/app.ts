import express from 'express'
import morgan from 'morgan'

const app = express()
app.use(morgan('combined'))

app.get('/', (req, res) => {
  console.log('estoy dentro')
  return res.status(200).json({ message: 'hello world' });
})

export default app