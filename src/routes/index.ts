import { Router } from 'express'
import myRouter from './my'
import moviesRouter from './movies'
import authRouter from './auth'
import usersRoute from './users'
import peopleRoute from './people'

const router = Router()

router.use('/my', myRouter)
router.use('/movies', moviesRouter)
router.use('/auth', authRouter)
router.use('/users', usersRoute)
router.use('/people', peopleRoute)

export default router
