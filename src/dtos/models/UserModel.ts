import { Field, ObjectType, ID } from 'type-graphql'
import { IsEmail } from 'class-validator'

@ObjectType()
export class UserModel {
  @Field((type) => ID, { nullable: true })
  id: string

  @Field({ nullable: true })
  name: string

  @Field({ nullable: true })
  @IsEmail()
  email: string

  @Field({ nullable: true })
  password: string

  @Field({ nullable: true })
  createdAt: Date

  @Field({ nullable: true })
  updatedAt: Date
}
