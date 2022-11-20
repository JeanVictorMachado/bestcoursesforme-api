import { AuthChecker } from 'type-graphql'
import { verify } from 'jsonwebtoken'

import AuthConfig from '../config/auth'

interface Context {
  token?: string
}

export const AuthAssurance: AuthChecker<Context> = ({ context }) => {
  const authHeader = context.token

  if (!authHeader) return false

  const [_, token] = authHeader.split(' ')

  if (!token) return false

  const decoded = verify(token, AuthConfig.jwt.secret)

  return !!decoded
}
