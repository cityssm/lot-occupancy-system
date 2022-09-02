import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getLotOccupancyFees = (lotOccupancyId, connectedDatabase) => {
    const database = connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });
    const lotOccupancyFees = database
        .prepare("select o.lotOccupancyId," +
        " o.feeId, c.feeCategory, f.feeName, f.includeQuantity," +
        " o.feeAmount, o.taxAmount, o.quantity" +
        " from LotOccupancyFees o" +
        " left join Fees f on o.feeId = f.feeId" +
        " left join FeeCategories c on f.feeCategoryId = c.feeCategoryId" +
        " where o.recordDelete_timeMillis is null" +
        " and o.lotOccupancyId = ?" +
        " order by o.recordCreate_timeMillis")
        .all(lotOccupancyId);
    if (!connectedDatabase) {
        database.close();
    }
    return lotOccupancyFees;
};
export default getLotOccupancyFees;
