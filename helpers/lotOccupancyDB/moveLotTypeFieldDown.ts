import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearLotTypesCache } from "../functions.cache.js";

export function moveLotTypeFieldDown(lotTypeFieldId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentField: { lotTypeId?: number; orderNumber: number } = database
        .prepare("select lotTypeId, orderNumber from LotTypeFields where lotTypeFieldId = ?")
        .get(lotTypeFieldId);

    database
        .prepare(
            `update LotTypeFields
                set orderNumber = orderNumber - 1
                where recordDelete_timeMillis is null
                and lotTypeId = ? and orderNumber = ? + 1`
        )
        .run(currentField.lotTypeId, currentField.orderNumber);

    const result = database
        .prepare("update LotTypeFields set orderNumber = ? + 1 where lotTypeFieldId = ?")
        .run(currentField.orderNumber, lotTypeFieldId);

    database.close();

    clearLotTypesCache();

    return result.changes > 0;
}

export function moveLotTypeFieldDownToBottom(lotTypeFieldId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentField: { lotTypeId?: number; orderNumber: number } = database
        .prepare("select lotTypeId, orderNumber from LotTypeFields where lotTypeFieldId = ?")
        .get(lotTypeFieldId);

    const maxOrderNumber: number = database
        .prepare(
            `select max(orderNumber) as maxOrderNumber
                from LotTypeFields
                where recordDelete_timeMillis is null
                and lotTypeId = ?`
        )
        .get(currentField.lotTypeId).maxOrderNumber;

    if (currentField.orderNumber !== maxOrderNumber) {
        database
            .prepare("update LotTypeFields set orderNumber = ? + 1 where lotTypeFieldId = ?")
            .run(maxOrderNumber, lotTypeFieldId);

        database
            .prepare(
                `update LotTypeFields
                    set orderNumber = orderNumber - 1
                    where recordDelete_timeMillis is null
                    and lotTypeId = ?
                    and orderNumber > ?`
            )
            .run(currentField.lotTypeId, currentField.orderNumber);
    }

    database.close();

    clearLotTypesCache();

    return true;
}

export default moveLotTypeFieldDown;
