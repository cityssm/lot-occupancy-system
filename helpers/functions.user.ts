import { getUserNameFromApiKey } from './functions.api.js'
import * as configFunctions from './functions.config.js'

import type { User } from '../types/recordTypes'

export interface UserRequest {
  session?: {
    user?: User
  }
}

export interface APIRequest {
  params?: {
    apiKey?: string
  }
}

export function userIsAdmin(request: UserRequest): boolean {
  const user = request.session?.user

  if (!user?.userProperties) {
    return false
  }

  return user.userProperties.isAdmin
}

export function userCanUpdate(request: UserRequest): boolean {
  const user = request.session?.user

  if (!user?.userProperties) {
    return false
  }

  return user.userProperties.canUpdate
}

export async function apiKeyIsValid(request: APIRequest): Promise<boolean> {
  const apiKey = request.params?.apiKey

  if (!apiKey) {
    return false
  }

  const userName = await getUserNameFromApiKey(apiKey)

  if (!userName) {
    return false
  }

  const canLogin = configFunctions
    .getProperty('users.canLogin')
    .some((currentUserName) => {
      return userName === currentUserName.toLowerCase()
    })

  return canLogin
}
