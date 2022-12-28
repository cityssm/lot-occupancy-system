import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { updateFeeOrderNumber } from "./updateFee.js";
export const getFees = (feeCategoryId, additionalFilters, connectedDatabase) => {
    const updateOrderNumbers = !(additionalFilters.lotTypeId || additionalFilters.occupancyTypeId);
    const database = connectedDatabase ||
        sqlite(databasePath, {
            readonly: !updateOrderNumbers
        });
    let sqlWhereClause = " where f.recordDelete_timeMillis is null" + " and f.feeCategoryId = ?";
    const sqlParameters = [feeCategoryId];
    if (additionalFilters.occupancyTypeId) {
        sqlWhereClause += " and (f.occupancyTypeId is null or f.occupancyTypeId = ?)";
        sqlParameters.push(additionalFilters.occupancyTypeId);
    }
    if (additionalFilters.lotTypeId) {
        sqlWhereClause += " and (f.lotTypeId is null or f.lotTypeId = ?)";
        sqlParameters.push(additionalFilters.lotTypeId);
    }
    const fees = database
        .prepare("select f.feeId, f.feeName, f.feeDescription," +
        " f.occupancyTypeId, o.occupancyType," +
        " f.lotTypeId, l.lotType," +
        " ifnull(f.feeAmount, 0) as feeAmount, f.feeFunction," +
        " f.taxAmount, f.taxPercentage," +
        " f.includeQuantity, f.quantityUnit," +
        " f.isRequired, f.orderNumber" +
        " from Fees f" +
        " left join OccupancyTypes o on f.occupancyTypeId = o.occupancyTypeId" +
        " left join LotTypes l on f.lotTypeId = l.lotTypeId" +
        sqlWhereClause +
        " order by f.orderNumber, f.feeName")
        .all(sqlParameters);
    if (updateOrderNumbers) {
        let expectedFeeOrderNumber = -1;
        for (const fee of fees) {
            expectedFeeOrderNumber += 1;
            if (fee.orderNumber !== expectedFeeOrderNumber) {
                updateFeeOrderNumber(fee.feeId, expectedFeeOrderNumber, database);
                fee.orderNumber = expectedFeeOrderNumber;
            }
        }
    }
    if (!connectedDatabase) {
        database.close();
    }
    return fees;
};
export default getFees;
