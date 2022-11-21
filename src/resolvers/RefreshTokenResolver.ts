import { sign, verify } from 'jsonwebtoken'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { Context } from '../context'
import AuthConfig from '../config/auth'

import { RefreshTokenInput } from '../dtos/inputs/RefreshTokenInput'
import { RefreshTokenModel } from '../dtos/models/RefreshTokenModel'
import dayjs from 'dayjs'

interface IPayloadToken {
  name: string
  sub: string
}

@Resolver(RefreshTokenModel)
export class RefreshTokenResolver {
  @Mutation(() => RefreshTokenModel)
  async createRefreshToken(@Arg('data') data: RefreshTokenInput, @Ctx() ctx: Context) {
    const {
      secretToken,
      expiresInToken,
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = AuthConfig.jwt

    const { name, sub } = verify(data.refreshToken, secretRefreshToken) as IPayloadToken

    if (!sub) throw new Error('Invalid refresh token.')

    console.log('sub: ', sub)
    console.log('refreshToken: ', data.refreshToken)

    const userRefreshToken = await ctx.prisma.tokens.findFirst({
      where: {
        user_id: sub,
        refresh_token: data.refreshToken,
      },
    })

    if (!userRefreshToken) throw new Error('Refresh token not found.')

    await ctx.prisma.tokens.delete({ where: { id: userRefreshToken?.id } })

    const newRefreshToken = sign({ name }, secretRefreshToken, {
      subject: String(sub),
      expiresIn: expiresInRefreshToken,
    })

    const refreshTokenExpiresDate = dayjs().add(expiresRefreshTokenDays, 'days').toDate()

    await ctx.prisma.tokens.create({
      data: {
        user_id: sub,
        refresh_token: newRefreshToken,
        expires_token: refreshTokenExpiresDate,
      },
    })

    const newToken = sign({}, secretToken, {
      subject: sub,
      expiresIn: expiresInToken,
    })

    return {
      token: newToken,
      refresh_token: newRefreshToken,
    }
  }
}
