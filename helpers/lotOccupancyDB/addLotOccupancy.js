import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { addOrUpdateLotOccupancyField } from "./addOrUpdateLotOccupancyField.js";
export const addLotOccupancy = (lotOccupancyForm, requestSession, connectedDatabase) => {
    const database = connectedDatabase || sqlite(databasePath);
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
        .run(lotOccupancyForm.occupancyTypeId, lotOccupancyForm.lotId === "" ? undefined : lotOccupancyForm.lotId, occupancyStartDate, lotOccupancyForm.occupancyEndDateString === ""
        ? undefined
        : dateTimeFunctions.dateStringToInteger(lotOccupancyForm.occupancyEndDateString), requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    const lotOccupancyId = result.lastInsertRowid;
    const occupancyTypeFieldIds = (lotOccupancyForm.occupancyTypeFieldIds || "").split(",");
    for (const occupancyTypeFieldId of occupancyTypeFieldIds) {
        const lotOccupancyFieldValue = lotOccupancyForm["lotOccupancyFieldValue_" + occupancyTypeFieldId];
        if (lotOccupancyFieldValue && lotOccupancyFieldValue !== "") {
            addOrUpdateLotOccupancyField({
                lotOccupancyId,
                occupancyTypeFieldId,
                lotOccupancyFieldValue
            }, requestSession, database);
        }
    }
    if (!connectedDatabase) {
        database.close();
    }
    return lotOccupancyId;
};
export default addLotOccupancy;
