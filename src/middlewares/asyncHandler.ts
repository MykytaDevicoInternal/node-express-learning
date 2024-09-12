import { Request, Response, NextFunction, RequestHandler } from 'express'

// Needed to handle async errors from handlers, because express currently not supporting it.
export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)
