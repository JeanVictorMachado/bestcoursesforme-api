import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateAppointmentInput {
  @Field()
  custumerId: string

  @Field()
  startsAt: Date

  @Field()
  endsAt: Date
}
