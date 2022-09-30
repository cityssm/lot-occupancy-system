import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearLotTypesCache } from "../functions.cache.js";

export const moveLotTypeFieldUp = (lotTypeFieldId: number | string): boolean => {
    const database = sqlite(databasePath);

    const currentField: { lotTypeId: number; orderNumber: number } = database
        .prepare(
            "select lotTypeId, orderNumber" + " from LotTypeFields" + " where lotTypeFieldId = ?"
        )
        .get(lotTypeFieldId);

    if (currentField.orderNumber <= 0) {
        database.close();
        return true;
    }

    database
        .prepare(
            "update LotTypeFields" +
                " set orderNumber = orderNumber + 1" +
                " where recordDelete_timeMillis is null" +
                " and lotTypeId = ?" +
                " and orderNumber = ? - 1"
        )
        .run(currentField.lotTypeId, currentField.orderNumber);

    const result = database
        .prepare("update LotTypeFields" + " set orderNumber = ? - 1" + " where lotTypeFieldId = ?")
        .run(currentField.orderNumber, lotTypeFieldId);

    database.close();

    clearLotTypesCache();

    return result.changes > 0;
};

export default moveLotTypeFieldUp;
