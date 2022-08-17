import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getFeeCategories = (filters, options) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    let sql = "select feeCategoryId, feeCategory" +
        " from FeeCategories" +
        " where recordDelete_timeMillis is null";
    let sqlParameters = [];
    if (filters.occupancyTypeId) {
        sql += " and feeCategoryId in (" +
            "select feeCategoryId from Fees" +
            " where recordDelete_timeMillis is null" +
            " and (occupancyTypeId is null or occupancyTypeId = ?))";
        sqlParameters.push(filters.occupancyTypeId);
    }
    if (filters.lotTypeId) {
        sql += " and feeCategoryId in (" +
            "select feeCategoryId from Fees" +
            " where recordDelete_timeMillis is null" +
            " and (lotTypeId is null or lotTypeId = ?))";
        sqlParameters.push(filters.lotTypeId);
    }
    const feeCategories = database.prepare(sql +
        " order by orderNumber, feeCategory")
        .all(sqlParameters);
    if (options.includeFees) {
        for (const feeCategory of feeCategories) {
            sql = "select f.feeId, f.feeName, f.feeDescription," +
                " f.occupancyTypeId, o.occupancyType," +
                " f.lotTypeId, l.lotType," +
                " f.feeAmount, f.feeFunction, f.taxAmount, f.taxPercentage," +
                " f.includeQuantity, f.quantityUnit," +
                " f.isRequired" +
                " from Fees f" +
                " left join OccupancyTypes o on f.occupancyTypeId = o.occupancyTypeId" +
                " left join LotTypes l on f.lotTypeId = l.lotTypeId" +
                " where f.recordDelete_timeMillis is null" +
                " and f.feeCategoryId = ?";
            sqlParameters = [];
            sqlParameters.push(feeCategory.feeCategoryId);
            if (filters.occupancyTypeId) {
                sql += " and (f.occupancyTypeId is null or f.occupancyTypeId = ?)";
                sqlParameters.push(filters.occupancyTypeId);
            }
            if (filters.lotTypeId) {
                sql += " and (f.lotTypeId is null or f.lotTypeId = ?)";
                sqlParameters.push(filters.lotTypeId);
            }
            feeCategory.fees = database.prepare(sql +
                " order by f.orderNumber, f.feeName")
                .all(sqlParameters);
        }
    }
    database.close();
    return feeCategories;
};
export default getFeeCategories;
