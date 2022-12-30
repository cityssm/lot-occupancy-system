import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { getFee } from "./getFee.js";

export function moveFeeUp(feeId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentFee = getFee(feeId, database);

    if (currentFee.orderNumber <= 0) {
        database.close();
        return true;
    }

    database
        .prepare(
            `update Fees
                set orderNumber = orderNumber + 1
                where recordDelete_timeMillis is null
                and feeCategoryId = ?
                and orderNumber = ? - 1`
        )
        .run(currentFee.feeCategoryId, currentFee.orderNumber);

    const result = database
        .prepare("update Fees set orderNumber = ? - 1 where feeId = ?")
        .run(currentFee.orderNumber, feeId);

    database.close();

    return result.changes > 0;
}

export function moveFeeUpToTop(feeId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentFee = getFee(feeId, database);

    if (currentFee.orderNumber > 0) {
        database.prepare("update Fees set orderNumber = -1 where feeId = ?").run(feeId);

        database
            .prepare(
                `update Fees
                    set orderNumber = orderNumber + 1
                    where recordDelete_timeMillis is null
                    and feeCategoryId = ?
                    and orderNumber < ?`
            )
            .run(currentFee.feeCategoryId, currentFee.orderNumber);
    }

    database.close();

    return true;
}

export default moveFeeUp;
