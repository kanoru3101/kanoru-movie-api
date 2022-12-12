import { Router, Request, Response } from 'express'

const router = Router()

router.get('/', (_req: Request, res: Response): string => {
  res.send('Express + TypeScript Server !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  return 7
})

export default router
