import express from 'express'
import dotenv from 'dotenv'
import { cors } from './middlewares/cors'

dotenv.config()

const { PORT } = process.env

const app = express()

app.use(cors)

app.get('/test', (req, res) => {
  res.send('Test text')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
