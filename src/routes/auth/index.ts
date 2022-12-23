import { Router } from 'express'
import * as authController from '../../controllers/auth'
import { SignIn } from './types'
import { RequestHandler } from '../../utils/requestHandler'

const router = Router()

router.put('/sign-in', async (req: RequestHandler<SignIn>, res) => {
  
  // await authController.createUser({
  //   email: req.body.email,
  //   password: req.body.password
  // })

  res.status(201).json({ token: "" })
})

export default router
