import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const addLotOccupancyOccupant = (lotOccupancyOccupantForm, requestSession) => {
    const database = sqlite(databasePath);
    let lotOccupantIndex = 0;
    const maxIndexResult = database.prepare("select lotOccupantIndex" +
        " from LotOccupancyOccupants" +
        " where lotOccupancyId = ?" +
        " order by lotOccupantIndex" +
        " limit 1")
        .get(lotOccupancyOccupantForm.lotOccupancyId);
    if (maxIndexResult) {
        lotOccupantIndex = maxIndexResult.lotOccupantIndex + 1;
    }
    const rightNowMillis = Date.now();
    database
        .prepare("insert into LotOccupancyOccupants (" +
        "lotOccupancyId, lotOccupantIndex," +
        " occupantId," +
        " lotOccupantTypeId," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?)")
        .run(lotOccupancyOccupantForm.lotOccupancyId, lotOccupantIndex, lotOccupancyOccupantForm.occupantId, lotOccupancyOccupantForm.lotOccupantTypeId, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    return lotOccupantIndex;
};
export default addLotOccupancyOccupant;
