import { Request, Response, NextFunction } from 'express'
import { z, ZodError, ZodIssue } from 'zod'
import { BadRequestError } from '@/utils/errors'

export const bodyValidationMiddleware = (schema: z.ZodObject<any, any>) => {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: ZodIssue) => ({
          message: `${issue.path.join('.')} field is ${issue.message}`,
        }))

        throw new BadRequestError(errorMessages[0].message)
      }
    }
  }
}
