import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getFeeCategories = (filters, options) => {
    const updateOrderNumbers = !(filters.lotTypeId || filters.occupancyTypeId) && options.includeFees;
    const database = sqlite(databasePath, {
        readonly: !updateOrderNumbers
    });
    let sql = "select feeCategoryId, feeCategory, orderNumber" +
        " from FeeCategories" +
        " where recordDelete_timeMillis is null";
    let sqlParameters = [];
    if (filters.occupancyTypeId) {
        sql +=
            " and feeCategoryId in (" +
                "select feeCategoryId from Fees" +
                " where recordDelete_timeMillis is null" +
                " and (occupancyTypeId is null or occupancyTypeId = ?))";
        sqlParameters.push(filters.occupancyTypeId);
    }
    if (filters.lotTypeId) {
        sql +=
            " and feeCategoryId in (" +
                "select feeCategoryId from Fees" +
                " where recordDelete_timeMillis is null" +
                " and (lotTypeId is null or lotTypeId = ?))";
        sqlParameters.push(filters.lotTypeId);
    }
    const feeCategories = database
        .prepare(sql + " order by orderNumber, feeCategory")
        .all(sqlParameters);
    if (options.includeFees) {
        let expectedFeeCategoryOrderNumber = -1;
        for (const feeCategory of feeCategories) {
            expectedFeeCategoryOrderNumber += 1;
            if (feeCategory.orderNumber !== expectedFeeCategoryOrderNumber) {
                database
                    .prepare("update FeeCategories" +
                    " set orderNumber = ?" +
                    " where feeCategoryId = ?")
                    .run(expectedFeeCategoryOrderNumber, feeCategory.feeCategoryId);
                feeCategory.orderNumber = expectedFeeCategoryOrderNumber;
            }
            sql =
                "select f.feeId, f.feeName, f.feeDescription," +
                    " f.occupancyTypeId, o.occupancyType," +
                    " f.lotTypeId, l.lotType," +
                    " ifnull(f.feeAmount, 0) as feeAmount, f.feeFunction," +
                    " f.taxAmount, f.taxPercentage," +
                    " f.includeQuantity, f.quantityUnit," +
                    " f.isRequired, f.orderNumber" +
                    " from Fees f" +
                    " left join OccupancyTypes o on f.occupancyTypeId = o.occupancyTypeId" +
                    " left join LotTypes l on f.lotTypeId = l.lotTypeId" +
                    " where f.recordDelete_timeMillis is null" +
                    " and f.feeCategoryId = ?";
            sqlParameters = [];
            sqlParameters.push(feeCategory.feeCategoryId);
            if (filters.occupancyTypeId) {
                sql +=
                    " and (f.occupancyTypeId is null or f.occupancyTypeId = ?)";
                sqlParameters.push(filters.occupancyTypeId);
            }
            if (filters.lotTypeId) {
                sql += " and (f.lotTypeId is null or f.lotTypeId = ?)";
                sqlParameters.push(filters.lotTypeId);
            }
            feeCategory.fees = database
                .prepare(sql + " order by f.orderNumber, f.feeName")
                .all(sqlParameters);
            if (updateOrderNumbers) {
                let expectedFeeOrderNumber = -1;
                for (const fee of feeCategory.fees) {
                    expectedFeeOrderNumber += 1;
                    if (fee.orderNumber !== expectedFeeOrderNumber) {
                        database
                            .prepare("update Fees" +
                            " set orderNumber = ?" +
                            " where feeId = ?")
                            .run(expectedFeeOrderNumber, fee.feeId);
                        fee.orderNumber = expectedFeeOrderNumber;
                    }
                }
            }
        }
    }
    database.close();
    return feeCategories;
};
export default getFeeCategories;
