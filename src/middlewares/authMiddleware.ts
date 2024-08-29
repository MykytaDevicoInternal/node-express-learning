import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { UnauthorizedError } from '@/utils/errors'
import TokenService from '@/services/tokenService'

dotenv.config()

export const authMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.header('Authorization')

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Invalid authorization header')
  }

  const token = authorizationHeader.replace('Bearer ', '')

  if (!token) {
    throw new UnauthorizedError('Authorization token not found')
  }

  try {
    TokenService.verify(token)
    // TODO: add token payload to req object

    next()
  } catch (err: unknown) {
    console.log(err)
    throw new UnauthorizedError('Invalid token')
  }
}
