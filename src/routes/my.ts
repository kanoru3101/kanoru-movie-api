import { Router, Request, Response } from 'express'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  // logger.log("debug", "Hello, Winston!");
  res.status(200).json({
    data: 'Express + TypeScript Server 4 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
  })
})

export default router
