import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { compare } from 'bcryptjs'
import { Context } from '../context'
import AuthConfig from '../config/auth'

import { AuthModel } from '../dtos/models/AuthModel'
import { SessionInput } from '../dtos/inputs/SessionInput'
import { sign } from 'jsonwebtoken'
import dayjs from 'dayjs'

@Resolver(AuthModel)
export class SessionResolver {
  @Mutation(() => AuthModel)
  async signIn(@Arg('data') data: SessionInput, @Ctx() ctx: Context) {
    const user = await ctx.prisma.user.findUnique({ where: { email: data.email } })

    if (!user) throw new Error('Incorrect email/password combination.')

    const passwordMatched = await compare(data.password, user.password)

    if (!passwordMatched) throw new Error('Incorrect email/password combination.')

    const {
      secretToken,
      expiresInToken,
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = AuthConfig.jwt

    const token = sign({}, secretToken, {
      subject: user.id,
      expiresIn: expiresInToken,
    })

    const refreshToken = sign({ name: data.email }, secretRefreshToken, {
      subject: user.id,
      expiresIn: expiresInRefreshToken,
    })

    const refreshTokenExpiresDate = dayjs().add(expiresRefreshTokenDays, 'days').toDate()

    await ctx.prisma.tokens.deleteMany({ where: { user_id: user.id } })

    await ctx.prisma.tokens.create({
      data: {
        user_id: user.id,
        refresh_token: refreshToken,
        expires_token: refreshTokenExpiresDate,
      },
    })

    return {
      user,
      token,
      refreshToken,
    }
  }
}
