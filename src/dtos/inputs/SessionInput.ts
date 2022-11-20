import { Field, InputType } from 'type-graphql'

@InputType()
export class SessionInput {
  @Field()
  email: string

  @Field()
  password: string
}
