import * as configFunctions from '../helpers/functions.config.js';
import Debug from 'debug';
const debug = Debug('lot-occupancy-system:databasePaths');
export const useTestDatabases = configFunctions.getProperty('application.useTestDatabases') ||
    process.env.TEST_DATABASES === 'true';
if (useTestDatabases) {
    debug('Using "-testing" databases.');
}
export const lotOccupancyDBLive = 'data/lotOccupancy.db';
export const lotOccupancyDBTesting = 'data/lotOccupancy-testing.db';
export const lotOccupancyDB = useTestDatabases
    ? lotOccupancyDBTesting
    : lotOccupancyDBLive;
export const backupFolder = 'data/backups';
