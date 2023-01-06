import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { getLotTypeFields } from "./getLotTypeFields.js";

import type * as recordTypes from "../../types/recordTypes";
import { updateRecordOrderNumber } from "./updateRecordOrderNumber.js";

export function getLotTypes(): recordTypes.LotType[] {
    const database = sqlite(databasePath);

    const lotTypes: recordTypes.LotType[] = database
        .prepare(
            `select lotTypeId, lotType, orderNumber
                from LotTypes
                where recordDelete_timeMillis is null
                order by orderNumber, lotType`
        )
        .all();

    let expectedTypeOrderNumber = -1;

    for (const lotType of lotTypes) {
        expectedTypeOrderNumber += 1;

        if (lotType.orderNumber !== expectedTypeOrderNumber) {
            updateRecordOrderNumber("LotTypes", lotType.lotTypeId, expectedTypeOrderNumber, database);

            lotType.orderNumber = expectedTypeOrderNumber;
        }

        lotType.lotTypeFields = getLotTypeFields(lotType.lotTypeId as number, database);
    }

    database.close();

    return lotTypes;
}

export default getLotTypes;
