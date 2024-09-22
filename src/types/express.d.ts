import 'express'

declare global {
  namespace Express {
    interface Response {
      sendSuccessResponse: (
        code: number,
        message?: string,
        data?: Record<string, unknown> | Record<string, unknown>[]
      ) => void
    }

    interface Request {
      userId?: string
    }
  }
}
