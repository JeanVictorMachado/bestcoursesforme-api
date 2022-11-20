import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { hash, compare } from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { Context } from '../context'

import { UserModel, UserWithTokenModel } from '../dtos/models/UserModel'
import { UserInput } from '../dtos/inputs/UserInput'

@Resolver()
export class UserResolver {
  @Query((returns) => UserModel, { nullable: true })
  async privateInfo(@Arg('token') token: string, @Ctx() ctx: Context): Promise<UserModel | null> {
    const dbToken = await ctx.prisma.tokens.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!dbToken) return null

    return dbToken.user
  }

  @Mutation((returns) => UserModel)
  async signUp(@Arg('data') data: UserInput, @Ctx() ctx: Context): Promise<UserModel> {
    const hashedPassword = await hash(data.password, 10)

    return ctx.prisma.users.create({
      data: { ...data, password: hashedPassword },
    })
  }

  @Mutation((returns) => UserWithTokenModel)
  async login(
    @Arg('data') data: UserInput,
    @Ctx() ctx: Context,
  ): Promise<{ user: UserModel; token: string } | null> {
    const user = await ctx.prisma.users.findUnique({ where: { email: data.email } })

    if (!user) return null

    const validation = await compare(data.password, user.password)

    if (!validation) return null

    const tokenCode = uuid()

    const token = await ctx.prisma.tokens.create({
      data: { token: tokenCode, user: { connect: { id: user.id } } },
    })

    return { user, token: token.token }
  }
}
