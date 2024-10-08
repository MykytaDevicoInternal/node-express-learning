export const HTTPStatusCodes = {
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NoContent: 204,
  PartialContent: 206,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  UnprocessableEntity: 422,
  TooManyRequests: 429,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
}

export const HTTPMessages = {
  Unauthorized: 'Unauthorized',
  BadRequest: 'Bad Request',
}

export const ErrorMessages = {
  SomethingWentWrong: 'Something went wrong',
}

export const EntityStatuses = {
  Active: 1,
  Removed: 0,
}
