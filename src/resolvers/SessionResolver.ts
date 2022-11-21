import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { compare } from 'bcryptjs'
import { Context } from '../context'

import { AuthModel } from '../dtos/models/AuthModel'
import { SessionInput } from '../dtos/inputs/SessionInput'
import { GenerateToken } from '../utils/GenerateToken'

@Resolver(AuthModel)
export class SessionResolver {
  @Mutation(() => AuthModel)
  async signIn(@Arg('data') data: SessionInput, @Ctx() ctx: Context) {
    const user = await ctx.prisma.user.findUnique({ where: { email: data.email } })

    if (!user) throw new Error('Incorrect email/password combination.')

    const passwordMatched = await compare(data.password, user.password)

    if (!passwordMatched) throw new Error('Incorrect email/password combination.')

    const generateToken = new GenerateToken()

    const token = generateToken.accessToken(user.id)
    const { token: refreshToken, expiresDate } = generateToken.refreshToken(data.email, user.id)

    await ctx.prisma.tokens.deleteMany({ where: { user_id: user.id } })

    await ctx.prisma.tokens.create({
      data: {
        user_id: user.id,
        refresh_token: refreshToken,
        expires_token: expiresDate,
      },
    })

    return {
      user,
      token,
      refreshToken,
    }
  }
}
