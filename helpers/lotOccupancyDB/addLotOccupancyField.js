import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const addLotOccupancyField = (lotOccupancyFieldForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    let success = true;
    try {
        database
            .prepare("insert into LotOccupancyFields (" +
            "lotOccupancyId, occupancyTypeFieldId," +
            " lotOccupancyFieldValue," +
            " recordCreate_userName, recordCreate_timeMillis," +
            " recordUpdate_userName, recordUpdate_timeMillis)" +
            " values (?, ?, ?, ?, ?, ?, ?)")
            .run(lotOccupancyFieldForm.lotOccupancyId, lotOccupancyFieldForm.occupancyTypeFieldId, lotOccupancyFieldForm.lotOccupancyFieldValue, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    }
    catch (_a) {
        success = false;
    }
    finally {
        database.close();
    }
    return success;
};
export default addLotOccupancyField;
