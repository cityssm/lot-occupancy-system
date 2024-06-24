import Debug from 'debug'

import { getConfigProperty } from '../helpers/functions.config.js'

const debug = Debug('lot-occupancy-system:databasePaths')

// Determine if test databases should be used

export const useTestDatabases =
  getConfigProperty('application.useTestDatabases') ||
  process.env.TEST_DATABASES === 'true'

if (useTestDatabases) {
  debug('Using "-testing" databases.')
}

export const lotOccupancyDBLive = 'data/lotOccupancy.db'
export const lotOccupancyDBTesting = 'data/lotOccupancy-testing.db'

export const lotOccupancyDB = useTestDatabases
  ? lotOccupancyDBTesting
  : lotOccupancyDBLive

export const backupFolder = 'data/backups'
