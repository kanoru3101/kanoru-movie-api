import { Router } from 'express'
import myRouter from './my'

const router = Router()

router.use('/', myRouter)

export default router
