import { Router, Request, Response } from 'express'

const router = Router()

router.get('/', (_req: Request, res: Response): number => {  
  res.send('Express + TypeScript Server !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  return 1;
})

export default router
