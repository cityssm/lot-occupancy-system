import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getLotOccupancyFields = (lotOccupancyId, connectedDatabase) => {
    const database = connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });
    const lotOccupancyFields = database
        .prepare("select o.lotOccupancyId," +
        " o.occupancyTypeFieldId, o.lotOccupancyFieldValue," +
        " f.occupancyTypeField," +
        " f.occupancyTypeFieldValues, f.isRequired, f.pattern, f.minimumLength, f.maximumLength," +
        " f.orderNumber" +
        " from LotOccupancyFields o" +
        " left join OccupancyTypeFields f on o.occupancyTypeFieldId = f.occupancyTypeFieldId" +
        " where o.recordDelete_timeMillis is null" +
        " and o.lotOccupancyId = ?" +
        " union" +
        " select ? as lotOccupancyId," +
        " f.occupancyTypeFieldId, '' as lotOccupancyFieldValue," +
        " f.occupancyTypeField," +
        " f.occupancyTypeFieldValues, f.isRequired, f.pattern, f.minimumLength, f.maximumLength," +
        " f.orderNumber" +
        " from OccupancyTypeFields f" +
        " where f.recordDelete_timeMillis is null" +
        " and f.occupancyTypeId in (select occupancyTypeId from LotOccupancies where lotOccupancyId = ?)" +
        " and f.occupancyTypeFieldId not in (select occupancyTypeFieldId from LotOccupancyFields where lotOccupancyId = ? and recordDelete_timeMillis is null)" +
        " order by orderNumber, occupancyTypeField")
        .all(lotOccupancyId, lotOccupancyId, lotOccupancyId, lotOccupancyId);
    if (!connectedDatabase) {
        database.close();
    }
    return lotOccupancyFields;
};
export default getLotOccupancyFields;
