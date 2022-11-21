import { Field, ObjectType, ID } from 'type-graphql'

@ObjectType()
export class CourseModel {
  @Field((type) => ID, { nullable: true })
  id: string

  @Field({ nullable: true })
  name: string

  @Field({ nullable: true })
  createdAt: Date

  @Field({ nullable: true })
  updatedAt: Date
}
