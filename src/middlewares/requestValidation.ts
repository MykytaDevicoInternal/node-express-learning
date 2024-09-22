import { Request, Response, NextFunction } from 'express'
import { z, ZodError, ZodIssue } from 'zod'
import { BadRequestError } from '@/utils/errors'

export const requestValidation = (
  schema: z.ZodObject<any, any>,
  type: 'body' | 'params' | 'query'
) => {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      switch (type) {
        case 'body':
          schema.parse(req.body)
          break
        case 'params':
          schema.parse(req.params)
          break
        case 'query':
          schema.parse(req.query)
          break
      }
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
