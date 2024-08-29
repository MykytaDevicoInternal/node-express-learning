import { Router, Request, Response } from 'express'
import { authMiddleware } from '@/middlewares/authMiddleware'
import { bodyValidationMiddleware } from '@/middlewares/bodyValidationMiddleware'
import { userLoginSchema } from '@/schemas/userSchema'

const router = Router()

router.post(
  '/login',
  bodyValidationMiddleware(userLoginSchema),
  async (req: Request, res: Response) => {
    res.send('Done')
  }
)

router.post('/signup')

router.post('/refresh', authMiddleware, async (req: Request, res: Response) => {
  res.send('Done')
})

export default router
