import { Router, Request, Response } from 'express'

const router = Router()

router.get('/', (_req: Request, res: Response): void => {
  res.send('Express + TypeScript Server !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  return 2
})

export default router
