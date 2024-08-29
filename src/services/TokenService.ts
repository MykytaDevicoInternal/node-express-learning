import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const { JWT_SECRET_KEY } = process.env

class TokenService {
  constructor() {}

  verify(token: string) {
    return jwt.verify(token, JWT_SECRET_KEY as string)
  }

  generateToken(userId: string, expiresIn: string) {
    const payload = {
      userId,
    }

    return jwt.sign(payload, JWT_SECRET_KEY as string, { expiresIn })
  }

  generateAuthTokens() {}
}

export default new TokenService()
