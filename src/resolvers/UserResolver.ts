import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { hash, compare } from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { Context } from '../context'

import { UserModel } from '../dtos/models/UserModel'
import { UserInput } from '../dtos/inputs/UserInput'

@Resolver(UserModel)
export class UserResolver {
  @Query(() => [UserModel])
  async findUsers(@Ctx() ctx: Context) {
    const users = await ctx.prisma.users.findMany()

    const usersWithoutPassword = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    })

    return usersWithoutPassword
  }

  @Query(() => UserModel)
  async findUserById(@Arg('id') id: string, @Ctx() ctx: Context) {
    const user = await ctx.prisma.users.findUnique({ where: { id } })

    if (!user) throw new Error('User does not exists')

    return user
  }

  @Mutation(() => UserModel)
  async createUser(@Arg('data') data: UserInput, @Ctx() ctx: Context) {
    const hashedPassword = await hash(data.password, 10)

    const user = await ctx.prisma.users.create({
      data: { ...data, password: hashedPassword },
    })

    return user
  }
}
