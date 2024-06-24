import type { config as MSSQLConfig } from 'mssql'

import { config } from '../data/config.js'
import type {
  ConfigActiveDirectory,
  ConfigNtfyStartup,
  DynamicsGPLookup
} from '../types/configTypes.js'

/*
 * SET UP FALLBACK VALUES
 */

const configFallbackValues = new Map<string, unknown>()

configFallbackValues.set('application.applicationName', 'Lot Occupancy System')
configFallbackValues.set(
  'application.backgroundURL',
  '/images/cemetery-background.jpg'
)
configFallbackValues.set('application.logoURL', '/images/cemetery-logo.png')
configFallbackValues.set('application.httpPort', 7000)
configFallbackValues.set('application.useTestDatabases', false)
configFallbackValues.set('application.maximumProcesses', 4)

configFallbackValues.set('reverseProxy.disableCompression', false)
configFallbackValues.set('reverseProxy.disableEtag', false)
configFallbackValues.set('reverseProxy.urlPrefix', '')

configFallbackValues.set('session.cookieName', 'lot-occupancy-system-user-sid')
configFallbackValues.set('session.secret', 'cityssm/lot-occupancy-system')
configFallbackValues.set('session.maxAgeMillis', 60 * 60 * 1000)
configFallbackValues.set('session.doKeepAlive', false)

configFallbackValues.set('users.testing', [])
configFallbackValues.set('users.canLogin', ['administrator'])
configFallbackValues.set('users.canUpdate', [])
configFallbackValues.set('users.isAdmin', ['administrator'])

configFallbackValues.set('aliases.lot', 'Lot')
configFallbackValues.set('aliases.lots', 'Lots')
configFallbackValues.set('aliases.map', 'Map')
configFallbackValues.set('aliases.maps', 'Maps')
configFallbackValues.set('aliases.occupancy', 'Occupancy')
configFallbackValues.set('aliases.occupancies', 'Occupancies')
configFallbackValues.set('aliases.occupancyStartDate', 'Start Date')
configFallbackValues.set('aliases.occupant', 'Occupant')
configFallbackValues.set('aliases.occupants', 'Occupants')
configFallbackValues.set(
  'aliases.externalReceiptNumber',
  'External Receipt Number'
)
configFallbackValues.set('aliases.workOrderOpenDate', 'Open Date')
configFallbackValues.set('aliases.workOrderCloseDate', 'Close Date')

configFallbackValues.set('settings.map.mapCityDefault', '')
configFallbackValues.set('settings.map.mapProvinceDefault', '')

configFallbackValues.set(
  'settings.lot.lotNameSortNameFunction',
  (lotName: string) => lotName
)

configFallbackValues.set(
  // eslint-disable-next-line no-secrets/no-secrets
  'settings.lotOccupancy.occupancyEndDateIsRequired',
  true
)
configFallbackValues.set('settings.lotOccupancy.occupantCityDefault', '')
configFallbackValues.set('settings.lotOccupancy.occupantProvinceDefault', '')
configFallbackValues.set('settings.lotOccupancy.prints', [
  'screen/lotOccupancy'
])

configFallbackValues.set('settings.fees.taxPercentageDefault', 0)

configFallbackValues.set('settings.workOrders.workOrderNumberLength', 6)
configFallbackValues.set(
  'settings.workOrders.workOrderMilestoneDateRecentBeforeDays',
  5
)
configFallbackValues.set(
  'settings.workOrders.workOrderMilestoneDateRecentAfterDays',
  60
)
configFallbackValues.set(
  'settings.workOrders.calendarEmailAddress',
  'no-reply@127.0.0.1'
)
configFallbackValues.set('settings.workOrders.prints', [
  'pdf/workOrder',
  'pdf/workOrder-commentLog'
])

configFallbackValues.set('settings.adminCleanup.recordDeleteAgeDays', 60)

configFallbackValues.set('settings.printPdf.contentDisposition', 'attachment')

configFallbackValues.set('settings.dynamicsGP.integrationIsEnabled', false)
configFallbackValues.set('settings.dynamicsGP.lookupOrder', ['invoice'])
configFallbackValues.set('settings.dynamicsGP.accountCodes', [])
configFallbackValues.set('settings.dynamicsGP.itemNumbers', [])
configFallbackValues.set('settings.dynamicsGP.trialBalanceCodes', [])

/*
 * Set up function overloads
 */

export function getConfigProperty(
  propertyName:
    | 'application.applicationName'
    | 'application.logoURL'
    | 'application.userDomain'
    | 'reverseProxy.urlPrefix'
    | 'session.cookieName'
    | 'session.secret'
    | 'aliases.lot'
    | 'aliases.lots'
    | 'aliases.map'
    | 'aliases.maps'
    | 'aliases.occupancy'
    | 'aliases.occupancies'
    | 'aliases.occupancyStartDate'
    | 'aliases.occupant'
    | 'aliases.occupants'
    | 'aliases.workOrderOpenDate'
    | 'aliases.workOrderCloseDate'
    | 'aliases.externalReceiptNumber'
    | 'settings.map.mapCityDefault'
    | 'settings.map.mapProvinceDefault'
    | 'settings.lot.lotNameHelpText'
    | 'settings.lotOccupancy.occupantCityDefault'
    | 'settings.lotOccupancy.occupantProvinceDefault'
    | 'settings.workOrders.calendarEmailAddress'
): string

export function getConfigProperty(
  propertyName:
    | 'application.httpPort'
    | 'application.maximumProcesses'
    | 'session.maxAgeMillis'
    | 'settings.fees.taxPercentageDefault'
    | 'settings.workOrders.workOrderNumberLength'
    | 'settings.workOrders.workOrderMilestoneDateRecentBeforeDays'
    | 'settings.workOrders.workOrderMilestoneDateRecentAfterDays'
    | 'settings.adminCleanup.recordDeleteAgeDays'
): number

export function getConfigProperty(
  propertyName:
    | 'application.useTestDatabases'
    | 'reverseProxy.disableCompression'
    | 'reverseProxy.disableEtag'
    | 'session.doKeepAlive'
    | 'settings.lotOccupancy.occupancyEndDateIsRequired'
    | 'settings.dynamicsGP.integrationIsEnabled'
): boolean

export function getConfigProperty(
  propertyName:
    | 'users.testing'
    | 'users.canLogin'
    | 'users.canUpdate'
    | 'users.isAdmin'
    | 'settings.dynamicsGP.accountCodes'
    | 'settings.dynamicsGP.itemNumbers'
    | 'settings.dynamicsGP.trialBalanceCodes'
    | 'settings.lotOccupancy.prints'
    | 'settings.workOrders.prints'
): string[]

export function getConfigProperty(
  propertyName: 'application.ntfyStartup'
): ConfigNtfyStartup | undefined

export function getConfigProperty(
  propertyName: 'activeDirectory'
): ConfigActiveDirectory

export function getConfigProperty(propertyName: 'settings.lot.lotNamePattern'): RegExp

export function getConfigProperty(
  propertyName: 'settings.lot.lotNameSortNameFunction'
): (lotName: string) => string

export function getConfigProperty(
  propertyName: 'settings.printPdf.contentDisposition'
): 'attachment' | 'inline'

export function getConfigProperty(
  propertyName: 'settings.dynamicsGP.mssqlConfig'
): MSSQLConfig

export function getConfigProperty(
  propertyName: 'settings.dynamicsGP.lookupOrder'
): DynamicsGPLookup[]

export function getConfigProperty(propertyName: string): unknown {
  const propertyNameSplit = propertyName.split('.')

  let currentObject = config

  for (const propertyNamePiece of propertyNameSplit) {
    if (Object.hasOwn(currentObject, propertyNamePiece)) {
      currentObject = currentObject[propertyNamePiece]
      continue
    }

    return configFallbackValues.get(propertyName)
  }

  return currentObject
}

export const keepAliveMillis = getConfigProperty('session.doKeepAlive')
  ? Math.max(
      getConfigProperty('session.maxAgeMillis') / 2,
      getConfigProperty('session.maxAgeMillis') - 10 * 60 * 1000
    )
  : 0
