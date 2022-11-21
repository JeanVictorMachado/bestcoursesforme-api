import 'reflect-metadata'

import path from 'node:path'

import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { context } from './context'

import { UserResolver } from './resolvers/UserResolver'
import { SessionResolver } from './resolvers/SessionResolver'
import { AuthAssurance } from './middlewares/AuthAssurance'
import { CourseResolver } from './resolvers/CourseResolver'
import { RefreshTokenResolver } from './resolvers/RefreshTokenResolver'

const bootstrap = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, SessionResolver, CourseResolver, RefreshTokenResolver],
    authChecker: AuthAssurance,
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  })

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const reqConfig = {
        req,
        token: req?.headers?.authorization,
      }

      return {
        ...context,
        ...reqConfig,
      }
    },
  })

  const { url } = await server.listen()

  console.log(`🚀 HTTP server running on ${url}`)
}

bootstrap()
