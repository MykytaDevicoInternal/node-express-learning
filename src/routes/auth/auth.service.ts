import bcrypt from 'bcrypt'
import { LoginRequestType, SingUpRequestType } from '@/schemas/userSchema'
import UserModel from '../../models/user'
import UserTokensModel from '../../models/userTokens'
import { NotFoundError, UnauthorizedError } from '@/utils/errors'
import TokenService from '../../services/TokenService'

export class AuthService {
  userModel = UserModel
  tokenService = TokenService
  userTokensModel = UserTokensModel

  constructor() {}

  async login(data: LoginRequestType) {
    const { email, password } = data

    const user = await this.userModel.findOneByEmail(email)
    if (!user) {
      throw new UnauthorizedError('The email or password is incorrect')
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      throw new UnauthorizedError('The email or password is incorrect')
    }

    return await this.tokenService.generateAuthTokens(user.id)
  }

  async signup(data: SingUpRequestType) {
    const { email, firstName, lastName, password } = data

    const hashedPassword = await bcrypt.hash(password, 10)

    await this.userModel.createUser({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    })
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token not found')
    }

    const decoded = this.tokenService.verify(refreshToken)

    const userToken = await this.userTokensModel.findOneByUserId(decoded.userId)

    if (!userToken) {
      throw new NotFoundError('User not found')
    }

    if (userToken.refreshToken !== refreshToken) {
      throw new UnauthorizedError('Refresh token is incorrect')
    }

    return await this.tokenService.generateAuthTokens(userToken.userId)
  }
}
