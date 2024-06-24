import Debug from 'debug'
import {
  type Request,
  type RequestHandler,
  type Response,
  Router
} from 'express'

import { useTestDatabases } from '../data/databasePaths.js'
import { getApiKey } from '../helpers/functions.api.js'
import * as authenticationFunctions from '../helpers/functions.authentication.js'
import { getConfigProperty } from '../helpers/functions.config.js'

const debug = Debug('lot-occupancy-system:login')

export const router = Router()

function getHandler(request: Request, response: Response): void {
  const sessionCookieName = getConfigProperty('session.cookieName')

  if (
    request.session.user !== undefined &&
    request.cookies[sessionCookieName] !== undefined
  ) {
    const redirectURL = authenticationFunctions.getSafeRedirectURL(
      (request.query.redirect ?? '') as string
    )

    response.redirect(redirectURL)
  } else {
    response.render('login', {
      userName: '',
      message: '',
      redirect: request.query.redirect,
      useTestDatabases
    })
  }
}

async function postHandler(
  request: Request,
  response: Response
): Promise<void> {
  const userName = (
    typeof request.body.userName === 'string' ? request.body.userName : ''
  ) as string

  const passwordPlain = (
    typeof request.body.password === 'string' ? request.body.password : ''
  ) as string

  const unsafeRedirectURL = request.body.redirect

  const redirectURL = authenticationFunctions.getSafeRedirectURL(
    typeof unsafeRedirectURL === 'string' ? unsafeRedirectURL : ''
  )

  let isAuthenticated = false

  if (userName.startsWith('*')) {
    if (useTestDatabases && userName === passwordPlain) {
      isAuthenticated = getConfigProperty('users.testing').includes(userName)

      if (isAuthenticated) {
        debug(`Authenticated testing user: ${userName}`)
      }
    }
  } else if (userName !== '' && passwordPlain !== '') {
    isAuthenticated = await authenticationFunctions.authenticate(
      userName,
      passwordPlain
    )
  }

  let userObject: User | undefined

  if (isAuthenticated) {
    const userNameLowerCase = userName.toLowerCase()

    const canLogin = getConfigProperty('users.canLogin').some(
      (currentUserName) => {
        return userNameLowerCase === currentUserName.toLowerCase()
      }
    )

    if (canLogin) {
      const canUpdate = getConfigProperty('users.canUpdate').some(
        (currentUserName) => {
          return userNameLowerCase === currentUserName.toLowerCase()
        }
      )

      const isAdmin = getConfigProperty('users.isAdmin').some(
        (currentUserName) => {
          return userNameLowerCase === currentUserName.toLowerCase()
        }
      )

      const apiKey = await getApiKey(userNameLowerCase)

      userObject = {
        userName: userNameLowerCase,
        userProperties: {
          canUpdate,
          isAdmin,
          apiKey
        }
      }
    }
  }

  if (isAuthenticated && userObject !== undefined) {
    request.session.user = userObject

    response.redirect(redirectURL)
  } else {
    response.render('login', {
      userName,
      message: 'Login Failed',
      redirect: redirectURL,
      useTestDatabases
    })
  }
}

router
  .route('/')
  .get(getHandler)
  .post(postHandler as RequestHandler)

export default router
