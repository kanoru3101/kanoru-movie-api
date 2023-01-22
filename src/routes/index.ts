import { Router } from 'express'
import myRouter from './my'
import moviesRouter from './movies'
import authRouter from './auth'
import usersRoute from './users'

const router = Router()

router.use('/', myRouter)
router.use('/movies', moviesRouter)
router.use('/auth', authRouter)
router.use('/users', usersRoute)

export default router
