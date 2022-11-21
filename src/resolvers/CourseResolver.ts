import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Context } from '../context'

import { CourseInput } from '../dtos/inputs/CourseInput'
import { CourseModel } from '../dtos/models/CourseModel'

@Resolver(CourseModel)
export class CourseResolver {
  @Authorized()
  @Query(() => [CourseModel])
  async findCourses(@Ctx() ctx: Context) {
    const courses = await ctx.prisma.course.findMany()

    if (!courses.length) throw new Error('There is no registered course.')

    return courses
  }

  @Authorized()
  @Query(() => CourseModel)
  async findCourseById(@Arg('id') id: string, @Ctx() ctx: Context) {
    const course = await ctx.prisma.course.findUnique({ where: { id } })

    if (!course) throw new Error('Course does not exists')

    return course
  }

  @Authorized()
  @Mutation(() => CourseModel)
  async createCourse(@Arg('data') data: CourseInput, @Ctx() ctx: Context) {
    const verifyIfCourseExists = await ctx.prisma.course.findFirst({ where: { name: data.name } })

    if (!!verifyIfCourseExists) throw new Error('This course already exists.')

    const course = await ctx.prisma.course.create({ data })

    return course
  }
}
