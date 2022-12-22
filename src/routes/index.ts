import { Router } from 'express'
import myRouter from './my'
import moviesRouter from './movies'

const router = Router()

router.use('/', myRouter)
router.use('/movies', moviesRouter)

export default router
