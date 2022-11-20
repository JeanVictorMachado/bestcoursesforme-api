import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { compare } from 'bcryptjs'
import { Context } from '../context'
import AuthConfig from '../config/auth'

import { AuthModel } from '../dtos/models/AuthModel'
import { SessionInput } from '../dtos/inputs/SessionInput'
import { sign } from 'jsonwebtoken'

@Resolver(AuthModel)
export class SessionResolver {
  @Mutation(() => AuthModel)
  async signIn(@Arg('data') data: SessionInput, @Ctx() ctx: Context) {
    const user = await ctx.prisma.users.findUnique({ where: { email: data.email } })

    if (!user) throw new Error('Incorrect email/password combination.')

    const passwordMatched = await compare(data.password, user.password)

    if (!passwordMatched) throw new Error('Incorrect email/password combination.')

    const { secret, expiresIn } = AuthConfig.jwt

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    })

    return {
      user,
      token,
    }
  }
}
