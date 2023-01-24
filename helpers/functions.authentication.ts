import * as configFunctions from './functions.config.js'

import ActiveDirectory from 'activedirectory2'

const userDomain = configFunctions.getProperty('application.userDomain')

const activeDirectoryConfig = configFunctions.getProperty('activeDirectory')

async function authenticateViaActiveDirectory(
  userName: string,
  password: string
): Promise<boolean> {
  return await new Promise((resolve) => {
    try {
      const ad = new ActiveDirectory(activeDirectoryConfig)

      ad.authenticate(userDomain + '\\' + userName, password, (error, auth) => {
        let authenticated = false

        if ((error ?? '') === '') {
          authenticated = auth
        }

        resolve(authenticated)
      })
    } catch {
      resolve(false)
    }
  })
}

export async function authenticate(
  userName: string,
  password: string
): Promise<boolean> {
  if ((userName ?? '') === '' || (password ?? '') === '') {
    return false
  }

  return await authenticateViaActiveDirectory(userName, password)
}

const safeRedirects = new Set([
  '/admin/cleanup',
  '/admin/fees',
  '/admin/lottypes',
  '/admin/occupancytypes',
  '/admin/tables',
  '/lotoccupancies',
  '/lotoccupancies/new',
  '/lots',
  '/lots/new',
  '/maps',
  '/maps/new',
  '/workorders',
  '/workorders/new',
  '/workorders/milestonecalendar',
  '/workorders/outlook',
  '/reports'
])

const recordUrl = /^(\/(maps|lots|lotoccupancies|workorders)\/)\d+(\/edit)?$/
const printUrl = /^\/print\/(pdf|screen)\/[\d/=?A-Za-z-]+$/

export function getSafeRedirectURL(possibleRedirectURL = ''): string {
  const urlPrefix = configFunctions.getProperty('reverseProxy.urlPrefix')

  if (typeof possibleRedirectURL === 'string') {
    const urlToCheck = possibleRedirectURL.startsWith(urlPrefix)
      ? possibleRedirectURL.slice(urlPrefix.length)
      : possibleRedirectURL

    const urlToCheckLowerCase = urlToCheck.toLowerCase()

    if (
      safeRedirects.has(urlToCheckLowerCase) ||
      recordUrl.test(urlToCheckLowerCase) ||
      printUrl.test(urlToCheck)
    ) {
      return urlPrefix + urlToCheck
    }
  }

  return urlPrefix + '/dashboard'
}
