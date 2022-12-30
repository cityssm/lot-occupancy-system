import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { getFee } from "./getFee.js";
export function moveFeeDown(feeId) {
    const database = sqlite(databasePath);
    const currentFee = getFee(feeId, database);
    database
        .prepare(`update Fees
                set orderNumber = orderNumber - 1
                where recordDelete_timeMillis is null
                and feeCategoryId = ?
                and orderNumber = ? + 1`)
        .run(currentFee.feeCategoryId, currentFee.orderNumber);
    const result = database
        .prepare("update Fees set orderNumber = ? + 1 where feeId = ?")
        .run(currentFee.orderNumber, feeId);
    database.close();
    return result.changes > 0;
}
export function moveFeeDownToBottom(feeId) {
    const database = sqlite(databasePath);
    const currentFee = getFee(feeId, database);
    const maxOrderNumber = database
        .prepare(`select max(orderNumber) as maxOrderNumber
                from Fees
                where recordDelete_timeMillis is null
                and feeCategoryId = ?`)
        .get(currentFee.feeCategoryId).maxOrderNumber;
    if (currentFee.orderNumber !== maxOrderNumber) {
        database
            .prepare("update Fees set orderNumber = ? + 1 where feeId = ?")
            .run(maxOrderNumber, feeId);
        database
            .prepare(`update Fees
                    set orderNumber = orderNumber - 1
                    where recordDelete_timeMillis is null
                    and feeCategoryId = ? and orderNumber > ?`)
            .run(currentFee.feeCategoryId, currentFee.orderNumber);
    }
    database.close();
    return true;
}
export default moveFeeDown;
