import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan  from 'morgan'
import { appRouter } from './routes/appRouter.js'
import cookieParser from 'cookie-parser'

const app = express()

// middlewares 
app.use(cors({
  origin: process.env.CORS_ORIGIN,  
  credentials: true
}))
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

// routes
app.use('/', appRouter)

export default app