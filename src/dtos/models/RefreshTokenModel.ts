import { Field, ObjectType, ID } from 'type-graphql'

@ObjectType()
export class RefreshTokenModel {
  @Field({ nullable: false })
  refresh_token: string

  @Field({ nullable: false })
  token: string

  @Field({ nullable: true })
  createdAt: Date

  @Field({ nullable: true })
  updatedAt: Date
}
