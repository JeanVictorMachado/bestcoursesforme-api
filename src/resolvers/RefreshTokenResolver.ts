import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { Context } from '../context'
import { GenerateToken } from '../utils/GenerateToken'
import { verify } from 'jsonwebtoken'
import AuthConfig from '../config/auth'

import { RefreshTokenInput } from '../dtos/inputs/RefreshTokenInput'
import { RefreshTokenModel } from '../dtos/models/RefreshTokenModel'

interface IPayloadToken {
  name: string
  sub: string
}

@Resolver(RefreshTokenModel)
export class RefreshTokenResolver {
  @Mutation(() => RefreshTokenModel)
  async createRefreshToken(@Arg('data') data: RefreshTokenInput, @Ctx() ctx: Context) {
    const { secretRefreshToken } = AuthConfig.jwt

    const { name, sub } = verify(data.refreshToken, secretRefreshToken) as IPayloadToken

    if (!sub) throw new Error('Invalid refresh token.')

    const userRefreshToken = await ctx.prisma.tokens.findFirst({
      where: {
        user_id: sub,
        refresh_token: data.refreshToken,
      },
    })

    if (!userRefreshToken) throw new Error('Refresh token not found.')

    await ctx.prisma.tokens.delete({ where: { id: userRefreshToken?.id } })

    const generateToken = new GenerateToken()

    const newToken = generateToken.accessToken(sub)
    const { token: newRefreshToken, expiresDate } = generateToken.refreshToken(name, sub)

    await ctx.prisma.tokens.create({
      data: {
        user_id: sub,
        refresh_token: newRefreshToken,
        expires_token: expiresDate,
      },
    })

    return {
      token: newToken,
      refresh_token: newRefreshToken,
    }
  }
}
