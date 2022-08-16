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
        sql = "select feeId, feeName, feeDescription," +
            " occupancyTypeId, lotTypeId," +
            " feeAmount, feeFunction, taxAmount, taxPercentage," +
            " isRequired" +
            " from Fees" +
            " where recordDelete_timeMillis is null" +
            " and feeCategoryId = ?";
        sqlParameters = [];
        for (const feeCategory of feeCategories) {
            sqlParameters.push(feeCategory.feeCategoryId);
            if (filters.occupancyTypeId) {
                sql += " and (occupancyTypeId is null or occupancyTypeId = ?)";
                sqlParameters.push(filters.occupancyTypeId);
            }
            if (filters.lotTypeId) {
                sql += " and (lotTypeId is null or lotTypeId = ?)";
                sqlParameters.push(filters.lotTypeId);
            }
            feeCategory.fees = database.prepare(sql +
                " order by orderNumber, feeName")
                .all(sqlParameters);
        }
    }
    database.close();
    return feeCategories;
};
export default getFeeCategories;
