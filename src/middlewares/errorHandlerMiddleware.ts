import { ErrorMessages } from '@/utils/constants'
import { IHTTPError } from '@/utils/types'
import { Request, Response, NextFunction } from 'express'

export const errorHandlerMiddleware = (
  error: IHTTPError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500
  const message = error.message || ErrorMessages.SomethingWentWrong

  return res.status(statusCode).send({ statusCode, message })
}
