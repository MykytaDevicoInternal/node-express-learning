import express from 'express'
import dotenv from 'dotenv'
import { cors } from './middlewares/cors'
import { db } from './utils/db'

dotenv.config()

const { PORT } = process.env

const app = express()

app.use(cors)
app.use(express.json())

app.get('/test', async (req, res) => {
  res.send('Test text')
})

app.post('/test', (req, res) => {
  const body = req.body
  res.send(body)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
