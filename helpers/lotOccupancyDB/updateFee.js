import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const updateFee = (feeForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update Fees" +
        " set feeCategoryId = ?," +
        " feeName = ?," +
        " feeDescription = ?," +
        " occupancyTypeId = ?," +
        " lotTypeId = ?," +
        " feeAmount = ?," +
        " feeFunction = ?," +
        " taxAmount = ?," +
        " taxPercentage = ?," +
        " includeQuantity = ?," +
        " quantityUnit = ?," +
        " isRequired = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where recordDelete_timeMillis is null" +
        " and feeId = ?")
        .run(feeForm.feeCategoryId, feeForm.feeName, feeForm.feeDescription, feeForm.occupancyTypeId || undefined, feeForm.lotTypeId || undefined, feeForm.feeAmount || undefined, feeForm.feeFunction || undefined, feeForm.taxAmount || undefined, feeForm.taxPercentage || undefined, feeForm.includeQuantity ? 1 : 0, feeForm.quantityUnit, feeForm.isRequired ? 1 : 0, requestSession.user.userName, rightNowMillis, feeForm.feeId);
    database.close();
    return result.changes > 0;
};
export const updateFeeOrderNumber = (feeId, orderNumber, connectedDatabase) => {
    const database = connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });
    const result = database
        .prepare("update Fees set orderNumber = ? where feeId = ?")
        .run(orderNumber, feeId);
    if (!connectedDatabase) {
        database.close();
    }
    return result.changes > 0;
};
export default updateFee;
