import express, { Express } from 'express'
import dotenv from 'dotenv'
import { myMiddleware } from './middlewares'
import routers from './routes'
import bodyParser from 'body-parser'
import connectDB from './config/typeormconfig'

dotenv.config()

connectDB

const PORT = (process.env.PORT || 8080) as number
const HOST = process.env.HOST || '0.0.0.0'
const app: Express = express()

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(myMiddleware)

app.use(routers)

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`⚡️[server]: Server is running at https://${HOST}:${PORT}`)
})
