import { Router } from 'express'
import myRouter from './my'
import moviesRouter from './movies'
import authRouter from './auth'

const router = Router()

router.use('/', myRouter)
router.use('/movies', moviesRouter)
router.use('/auth', authRouter)

export default router
