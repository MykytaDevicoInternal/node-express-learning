import { NextFunction, Request, Response } from 'express'

export const handleSuccessResponse = (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  res.sendSuccessResponse = function (
    code: number,
    message: string,
    data?: Record<string, unknown>
  ) {
    res.status(code).json({ message, success: true, data })
  }

  next()
}
