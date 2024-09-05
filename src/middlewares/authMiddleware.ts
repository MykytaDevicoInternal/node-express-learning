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
  const token = req.cookies.token

  if (!token) {
    throw new UnauthorizedError('Authorization token not found')
  }

  TokenService.verify(token)
  // TODO: add token payload to req object

  next()
}
