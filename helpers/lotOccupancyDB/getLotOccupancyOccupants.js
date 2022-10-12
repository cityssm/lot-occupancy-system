import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getLotOccupancyOccupants = (lotOccupancyId, connectedDatabase) => {
    const database = connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });
    const lotOccupancyOccupants = database
        .prepare("select o.lotOccupancyId, o.lotOccupantIndex," +
        " o.occupantName, o.occupantAddress1, o.occupantAddress2," +
        " o.occupantCity, o.occupantProvince, o.occupantPostalCode," +
        " o.occupantPhoneNumber, o.occupantEmailAddress," +
        " o.lotOccupantTypeId, t.lotOccupantType" +
        " from LotOccupancyOccupants o" +
        " left join LotOccupantTypes t on o.lotOccupantTypeId = t.lotOccupantTypeId" +
        " where o.recordDelete_timeMillis is null" +
        " and o.lotOccupancyId = ?" +
        " order by t.orderNumber, t.lotOccupantType, o.occupantName, o.lotOccupantIndex")
        .all(lotOccupancyId);
    if (!connectedDatabase) {
        database.close();
    }
    return lotOccupancyOccupants;
};
export default getLotOccupancyOccupants;
