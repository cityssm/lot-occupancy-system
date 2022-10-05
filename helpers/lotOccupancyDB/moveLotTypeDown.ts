import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearLotTypesCache } from "../functions.cache.js";

export const moveLotTypeDown = (lotTypeId: number | string): boolean => {
    const database = sqlite(databasePath);

    const currentOrderNumber: number = database
        .prepare("select orderNumber from LotTypes where lotTypeId = ?")
        .get(lotTypeId).orderNumber;

    database
        .prepare(
            "update LotTypes" +
                " set orderNumber = orderNumber - 1" +
                " where recordDelete_timeMillis is null" +
                " and orderNumber = ? + 1"
        )
        .run(currentOrderNumber);

    const result = database
        .prepare("update LotTypes set orderNumber = ? + 1 where lotTypeId = ?")
        .run(currentOrderNumber, lotTypeId);

    database.close();

    clearLotTypesCache();

    return result.changes > 0;
};

export const moveLotTypeDownToBottom = (lotTypeId: number | string): boolean => {
    const database = sqlite(databasePath);

    const currentOrderNumber: number = database
        .prepare("select orderNumber from LotTypes where lotTypeId = ?")
        .get(lotTypeId).orderNumber;

    const maxOrderNumber: number = database
        .prepare(
            "select max(orderNumber) as maxOrderNumber" +
                " from LotTypes" +
                " where recordDelete_timeMillis is null"
        )
        .get().maxOrderNumber;

    if (currentOrderNumber !== maxOrderNumber) {
        database
            .prepare("update LotTypes set orderNumber = ? + 1 where lotTypeId = ?")
            .run(maxOrderNumber, lotTypeId);

        database
            .prepare(
                "update LotTypes" +
                    " set orderNumber = orderNumber - 1" +
                    " where recordDelete_timeMillis is null" +
                    " and orderNumber > ?"
            )
            .run(currentOrderNumber);
    }

    database.close();

    clearLotTypesCache();

    return true;
};

export default moveLotTypeDown;
