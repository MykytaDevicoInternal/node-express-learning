import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { UnauthorizedError } from '@/utils/errors'
import TokenService from '../services/TokenService'

dotenv.config()

export const authMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken

  if (!token) {
    throw new UnauthorizedError('Authorization token not found')
  }

  const decoded = TokenService.verify(token)
  req.userId = decoded.userId

  next()
}
