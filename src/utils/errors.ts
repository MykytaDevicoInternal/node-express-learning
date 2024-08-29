import { HTTPMessages, HTTPStatusCodes } from './constants'

export class UnauthorizedError extends Error {
  statusCode = HTTPStatusCodes.Unauthorized

  constructor(message: string = HTTPMessages.Unauthorized) {
    super(message)
  }
}

export class BadRequestError extends Error {
  statusCode = HTTPStatusCodes.BadRequest

  constructor(message: string = HTTPMessages.BadRequest) {
    super(message)
  }
}