import * as configFunctions from "../helpers/functions.config.js";
import Debug from "debug";
const debug = Debug("lot-occupancy-system:databasePaths");
export const useTestDatabases = configFunctions.getProperty("application.useTestDatabases") || process.env.TEST_DATABASES === "true";
if (useTestDatabases) {
    debug("Using \"-testing\" databases.");
}
export const lotOccupancyDB_live = "data/lotOccupancy.db";
export const lotOccupancyDB_testing = "data/lotOccupancy-testing.db";
export const lotOccupancyDB = useTestDatabases
    ? lotOccupancyDB_testing
    : lotOccupancyDB_live;
