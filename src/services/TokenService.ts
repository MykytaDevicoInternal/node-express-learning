import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import userTokens from '../models/userTokens'
import { UnauthorizedError } from '@/utils/errors'

dotenv.config()

const {
  JWT_SECRET_KEY,
  ACCESS_TOKEN_EXPIRATION_MINUTES,
  REFRESH_TOKEN_EXPIRATION_MINUTES,
} = process.env

class TokenService {
  userTokensModel = userTokens

  constructor() {}

  verify(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET_KEY as string) as JwtPayload
    } catch (error: unknown) {
      console.log('🚀 ~ TokenService ~ verify ~ error:', error)
      throw new UnauthorizedError('Invalid token')
    }
  }

  generateToken(userId: string, expiresIn: string) {
    const payload = {
      userId,
    }

    return jwt.sign(payload, JWT_SECRET_KEY as string, { expiresIn })
  }

  async generateAuthTokens(userId: string) {
    const accessTokenExpires = `${ACCESS_TOKEN_EXPIRATION_MINUTES}m`
    const refreshTokenExpires = `${REFRESH_TOKEN_EXPIRATION_MINUTES}m`

    const accessToken = this.generateToken(userId, accessTokenExpires)
    const refreshToken = this.generateToken(userId, refreshTokenExpires)

    await this.userTokensModel.addRefreshToken(userId, refreshToken)

    return { accessToken, refreshToken }
  }
}

export default new TokenService()
