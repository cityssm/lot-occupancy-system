import sqlite from "better-sqlite3";
import * as configFunctions from "../functions.config.js";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
const availablePrints = configFunctions.getProperty("settings.lotOccupancy.prints");
const userFunction_configContainsPrintEJS = (printEJS) => {
    if (printEJS === "*" || availablePrints.includes(printEJS)) {
        return 1;
    }
    return 0;
};
export const getOccupancyTypePrints = (occupancyTypeId, connectedDatabase) => {
    const database = connectedDatabase || sqlite(databasePath);
    database.function("userFn_configContainsPrintEJS", userFunction_configContainsPrintEJS);
    const results = database
        .prepare("select printEJS, orderNumber" +
        " from OccupancyTypePrints" +
        " where recordDelete_timeMillis is null" +
        " and occupancyTypeId = ?" +
        " and userFn_configContainsPrintEJS(printEJS) = 1" +
        " order by orderNumber, printEJS")
        .all(occupancyTypeId);
    let expectedOrderNumber = -1;
    const prints = [];
    for (const result of results) {
        expectedOrderNumber += 1;
        if (result.orderNumber !== expectedOrderNumber) {
            database
                .prepare("update OccupancyTypeFields" +
                " set orderNumber = ?" +
                " where occupancyTypeId = ?" +
                " and printEJS = ?")
                .run(expectedOrderNumber, occupancyTypeId, result.printEJS);
        }
        prints.push(result.printEJS);
    }
    if (!connectedDatabase) {
        database.close();
    }
    return prints;
};
export default getOccupancyTypePrints;