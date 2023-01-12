import { Router } from 'express'

import * as configFunctions from '../helpers/functions.config.js'

import * as authenticationFunctions from '../helpers/functions.authentication.js'

import { useTestDatabases } from '../data/databasePaths.js'

import { getApiKey } from '../helpers/functions.api.js'

import Debug from 'debug'

import type * as recordTypes from '../types/recordTypes'

const debug = Debug('lot-occupancy-system:login')

export const router = Router()

router
  .route('/')
  .get((request, response) => {
    const sessionCookieName = configFunctions.getProperty('session.cookieName')

    if (request.session.user && request.cookies[sessionCookieName]) {
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
  })
  .post(async (request, response) => {
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

    if (userName.charAt(0) === '*') {
      if (useTestDatabases && userName === passwordPlain) {
        isAuthenticated = configFunctions
          .getProperty('users.testing')
          .includes(userName)

        if (isAuthenticated) {
          debug('Authenticated testing user: ' + userName)
        }
      }
    } else if (userName !== '' && passwordPlain !== '') {
      isAuthenticated = await authenticationFunctions.authenticate(
        userName,
        passwordPlain
      )
    }

    let userObject: recordTypes.User | undefined

    if (isAuthenticated) {
      const userNameLowerCase = userName.toLowerCase()

      const canLogin = configFunctions
        .getProperty('users.canLogin')
        .some((currentUserName) => {
          return userNameLowerCase === currentUserName.toLowerCase()
        })

      if (canLogin) {
        const canUpdate = configFunctions
          .getProperty('users.canUpdate')
          .some((currentUserName) => {
            return userNameLowerCase === currentUserName.toLowerCase()
          })

        const isAdmin = configFunctions
          .getProperty('users.isAdmin')
          .some((currentUserName) => {
            return userNameLowerCase === currentUserName.toLowerCase()
          })

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

    if (isAuthenticated && userObject) {
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
  })

export default router
