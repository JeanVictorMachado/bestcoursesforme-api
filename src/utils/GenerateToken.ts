import dayjs from 'dayjs'
import { sign } from 'jsonwebtoken'
import AuthConfig from '../config/auth'

export class GenerateToken {
  accessToken(subject: string) {
    const { secretToken, expiresInToken } = AuthConfig.jwt

    const token = sign({}, secretToken, {
      subject,
      expiresIn: expiresInToken,
    })

    return token
  }

  refreshToken(name: string, subject: string) {
    const { secretRefreshToken, expiresInRefreshToken, expiresRefreshTokenDays } = AuthConfig.jwt

    console.log('secretRefreshToken: ', secretRefreshToken)
    console.log('expiresInRefreshToken: ', expiresInRefreshToken)
    console.log('expiresRefreshTokenDays: ', expiresRefreshTokenDays)
    console.log('name: ', name)

    const token = sign({ name }, secretRefreshToken, {
      subject,
      expiresIn: expiresInRefreshToken,
    })

    const expiresDate = dayjs().add(expiresRefreshTokenDays, 'days').toDate()

    return {
      token,
      expiresDate,
    }
  }
}
