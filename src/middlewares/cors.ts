import { Request, Response, NextFunction } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction) => {
  const method = req.method && req.method.toUpperCase()

  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Request-Method', [
      'GET, POST, PUT, PATCH, DELETE',
    ])
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    res.status(204)
    res.setHeader('Content-Length', '0')
    res.end()
  } else {
    next()
  }
}
