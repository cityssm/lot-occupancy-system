import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getLotOccupancyOccupants = (lotOccupancyId, connectedDatabase) => {
    const database = connectedDatabase || sqlite(databasePath, {
        readonly: true
    });
    const lotOccupancyOccupants = database
        .prepare("select o.lotOccupancyId, o.lotOccupantIndex," +
        " o.occupantId," +
        " n.occupantName, n.occupantAddress1, n.occupantAddress2," +
        " n.occupantCity, n.occupantProvince, n.occupantPostalCode, n.occupantPhoneNumber," +
        " o.lotOccupantTypeId, t.lotOccupantType" +
        " from LotOccupancyOccupants o" +
        " left join Occupants n on o.occupantId = n.occupantId" +
        " left join LotOccupantTypes t on o.lotOccupantTypeId = t.lotOccupantTypeId" +
        " where o.recordDelete_timeMillis is null" +
        " and o.lotOccupancyId = ?" +
        " order by t.orderNumber, t.lotOccupantType, n.occupantName, o.lotOccupantIndex")
        .all(lotOccupancyId);
    if (!connectedDatabase) {
        database.close();
    }
    return lotOccupancyOccupants;
};
export default getLotOccupancyOccupants;
