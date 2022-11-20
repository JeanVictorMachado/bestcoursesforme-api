import { Field, ObjectType } from 'type-graphql'
import { UserModel } from './UserModel'

@ObjectType()
export class AuthModel {
  @Field(() => UserModel, { nullable: false })
  user: UserModel

  @Field({ nullable: false })
  token: string
}
