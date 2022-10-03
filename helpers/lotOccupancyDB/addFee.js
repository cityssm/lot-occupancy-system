import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const addFee = (feeForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("insert into Fees (" +
        "feeCategoryId, feeName, feeDescription," +
        " occupancyTypeId, lotTypeId," +
        " feeAmount, feeFunction," +
        " taxAmount, taxPercentage," +
        " includeQuantity, quantityUnit," +
        " isRequired, orderNumber," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(feeForm.feeCategoryId, feeForm.feeName, feeForm.feeDescription, feeForm.occupancyTypeId || undefined, feeForm.lotTypeId || undefined, feeForm.feeAmount || undefined, feeForm.feeFunction || undefined, feeForm.taxAmount || undefined, feeForm.taxPercentage || undefined, feeForm.includeQuantity ? 1 : 0, feeForm.quantityUnit, feeForm.isRequired ? 1 : 0, feeForm.orderNumber || -1, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    return result.lastInsertRowid;
};
export default addFee;
