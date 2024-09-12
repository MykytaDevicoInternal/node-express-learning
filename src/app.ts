import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { cors } from './middlewares/cors'
import router from './routes'
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware'
import { handleSuccessResponse } from './middlewares/handleSuccessResponse'

dotenv.config()

const { PORT } = process.env

const app = express()

app.use(cors)
app.use(express.json())
app.use(cookieParser())
app.use(handleSuccessResponse)

app.use(router)

app.use(errorHandlerMiddleware)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
