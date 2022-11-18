import { ApolloServer, gql } from 'apollo-server'
import { randomUUID } from 'node:crypto'

interface User {
  id: string
  name: string
}

const users: User[] = []

const typeDefs = gql`
  type User {
    id: String!
    name: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    cresteUser(name: String!): User!
  }
`

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      users: () => {
        return users
      },
    },

    Mutation: {
      cresteUser: (_, args) => {
        const user = {
          id: randomUUID(),
          name: args.name,
        }

        users.push(user)

        return user
      },
    },
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀 HTTP server running on ${url}`)
})
