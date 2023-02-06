import { Router } from 'express'
import * as authController from '@controllers/auth'
import { SignIn, SingUp } from './types'
import { TypeHandler, routeHandler } from '@utils'

const router = Router()


router
  .post('/', routeHandler(async (req: TypeHandler<SignIn>, res) => {
    const token = await authController.signIn({
      email: req.body.email,
      password: req.body.password
    })

    res.status(200).json({ token })
  }))
  .put('/', routeHandler(async (req: TypeHandler<SingUp>, res) => {
    const token = await authController.signUp({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })

    res.status(201).json({ token })
  }))

export default router
