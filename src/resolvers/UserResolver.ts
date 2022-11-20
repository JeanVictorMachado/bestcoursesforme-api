import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { hash } from 'bcryptjs'
import { Context } from '../context'

import { UserModel } from '../dtos/models/UserModel'
import { UserInput } from '../dtos/inputs/UserInput'

@Resolver(UserModel)
export class UserResolver {
  @Query(() => [UserModel])
  async findUsers(@Ctx() ctx: Context) {
    const users = await ctx.prisma.users.findMany()

    const usersWithoutPassword = users.map((user) => {
      const { id, name, email, createdAt, updatedAt } = user

      return {
        id,
        name,
        email,
        createdAt,
        updatedAt,
      }
    })

    return usersWithoutPassword
  }

  @Query(() => UserModel)
  async findUserById(@Arg('id') id: string, @Ctx() ctx: Context) {
    const user = await ctx.prisma.users.findUnique({ where: { id } })

    if (!user) throw new Error('User does not exists')

    const { id: idUser, name, email, createdAt, updatedAt } = user

    return {
      id: idUser,
      name,
      email,
      createdAt,
      updatedAt,
    }
  }

  @Mutation(() => UserModel)
  async createUser(@Arg('data') data: UserInput, @Ctx() ctx: Context) {
    const hashedPassword = await hash(data.password, 10)

    const { id, name, email, createdAt, updatedAt } = await ctx.prisma.users.create({
      data: { ...data, password: hashedPassword },
    })

    return {
      id,
      name,
      email,
      createdAt,
      updatedAt,
    }
  }
}
