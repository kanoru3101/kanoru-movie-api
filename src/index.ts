import express, { Express } from 'express'
import dotenv from 'dotenv'
import { myMiddleware } from './middlewares'
import routers from './routes'
import bodyParser from 'body-parser'
import connectDB from './config/typeormconfig'

dotenv.config()

connectDB

const app: Express = express()
const port = process.env.API_PORT

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(myMiddleware)

app.use(routers)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
