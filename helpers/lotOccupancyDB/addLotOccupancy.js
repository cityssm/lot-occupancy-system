import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const addLotOccupancy = (lotOccupancyForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const occupancyStartDate = dateTimeFunctions.dateStringToInteger(lotOccupancyForm.occupancyStartDateString);
    if (occupancyStartDate <= 0) {
        console.error(lotOccupancyForm);
    }
    const result = database
        .prepare("insert into LotOccupancies (" +
        "occupancyTypeId, lotId," +
        " occupancyStartDate, occupancyEndDate," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?)")
        .run(lotOccupancyForm.occupancyTypeId, lotOccupancyForm.lotId, occupancyStartDate, (lotOccupancyForm.occupancyEndDateString === ""
        ? undefined
        : dateTimeFunctions.dateStringToInteger(lotOccupancyForm.occupancyEndDateString)), requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    return result.lastInsertRowid;
};
export default addLotOccupancy;
