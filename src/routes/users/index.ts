import { Router } from 'express'
import * as userController from '@controllers/user'
import { GetUser } from './types'
import {routeHandler, TypeHandler} from '@utils'

const router = Router()


router.get('/', routeHandler(async (req: TypeHandler<GetUser>, res) => {
  const userId = req.user?.id;

  const user = await userController.getUser({ userId })

  res.status(200).json(user)
}));

export default router;
