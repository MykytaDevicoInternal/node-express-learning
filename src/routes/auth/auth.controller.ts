import { Router, Request, Response } from 'express'
import { requestValidation } from '@/middlewares/requestValidation'
import {
  SingUpRequestType,
  LoginRequestType,
  userLoginSchema,
  userSingUpSchema,
} from '@/schemas/userSchema'
import { AuthService } from './auth.service'
import { HTTPStatusCodes } from '@/utils/constants'
import { asyncHandler } from '@/middlewares/asyncHandler'

const router = Router()

const authService = new AuthService()

router.post(
  '/login',
  requestValidation(userLoginSchema, 'body'),
  asyncHandler(
    async (req: Request<unknown, unknown, LoginRequestType>, res: Response) => {
      const { accessToken, refreshToken } = await authService.login(req.body)

      res.cookie('accessToken', accessToken)
      res.cookie('refreshToken', refreshToken)
      res.sendSuccessResponse(HTTPStatusCodes.Ok, 'Successfully authorized')
    }
  )
)

router.post(
  '/signup',
  requestValidation(userSingUpSchema, 'body'),
  asyncHandler(
    async (
      req: Request<unknown, unknown, SingUpRequestType>,
      res: Response
    ) => {
      await authService.signup(req.body)
      res.sendSuccessResponse(
        HTTPStatusCodes.Created,
        'User successfully sign up'
      )
    }
  )
)

router.post(
  '/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken

    const { accessToken, refreshToken } = await authService.refresh(
      incomingRefreshToken
    )

    res.cookie('accessToken', accessToken)
    res.cookie('refreshToken', refreshToken)
    res.sendSuccessResponse(
      HTTPStatusCodes.Ok,
      'Refresh token has been updated'
    )
  })
)

export default router
