import 'reflect-metadata'

import path from 'node:path'

import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { context } from './context'

import { AppointmentsResolver } from './resolvers/appointments-resolver'
import { UserResolver } from './resolvers/UserResolver'

const bootstrap = async () => {
  const schema = await buildSchema({
    resolvers: [AppointmentsResolver, UserResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  })

  const server = new ApolloServer({
    schema,
    context,
  })

  const { url } = await server.listen()

  console.log(`🚀 HTTP server running on ${url}`)
}

bootstrap()
