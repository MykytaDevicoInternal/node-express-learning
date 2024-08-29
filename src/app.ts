import express from 'express'
import dotenv from 'dotenv'
import { cors } from './middlewares/cors'
import router from './routes'
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware'

dotenv.config()

const { PORT } = process.env

const app = express()

app.use(cors)
app.use(express.json())

app.use(router)

app.use(errorHandlerMiddleware)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
