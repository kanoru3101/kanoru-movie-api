import { Router } from 'express'
import myRouter from './my'
import moviesRouter from './movies'
import authRouter from './auth'
import usersRoute from './users'
import peopleRoute from './people'
import searchRoute from './search'
import tvsRouter from './tv'

const router = Router()

router.use('/my', myRouter)
router.use('/movies', moviesRouter)
router.use('/tvs', tvsRouter)
router.use('/auth', authRouter)
router.use('/users', usersRoute)
router.use('/people', peopleRoute)
router.use('/search', searchRoute)

export default router
