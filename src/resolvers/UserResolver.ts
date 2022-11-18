import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { Context } from '../context'

import { UserModel } from '../dtos/models/UserModel'

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
}
