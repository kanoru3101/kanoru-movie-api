import { Router } from 'express'
import * as userController from '@controllers/user'
import {ChangeLanguage, GetUser} from './types'
import { routeHandler, TypeHandler } from '@utils'

const router = Router()


router.get('/', routeHandler(async (req: TypeHandler<GetUser>, res) => {
  const userId = req.user?.id;

  const user = await userController.getUser({ userId })

  res.status(200).json(user)
}));

router.post('/language', routeHandler(async (req: TypeHandler<ChangeLanguage>, res) => {
  await userController.updateUserLanguage({
    userId: req.user?.id,
    language: req.body.language
  })

  res.status(200).json({ status: "OK"})
}));

export default router;
