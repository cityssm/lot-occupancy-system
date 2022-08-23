import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getFee = (feeId) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const fee = database.prepare("select f.feeId," +
        " f.feeCategoryId, c.feeCategory," +
        " f.feeName, f.feeDescription," +
        " f.occupancyTypeId, o.occupancyType," +
        " f.lotTypeId, l.lotType," +
        " ifnull(f.feeAmount, 0) as feeAmount, f.feeFunction," +
        " f.taxAmount, f.taxPercentage," +
        " f.includeQuantity, f.quantityUnit," +
        " f.isRequired" +
        " from Fees f" +
        " left join FeeCategories c on f.feeCategoryId = c.feeCategoryId" +
        " left join OccupancyTypes o on f.occupancyTypeId = o.occupancyTypeId" +
        " left join LotTypes l on f.lotTypeId = l.lotTypeId" +
        " where f.recordDelete_timeMillis is null" +
        " and f.feeId = ?")
        .get(feeId);
    database.close();
    return fee;
};
export default getFee;
