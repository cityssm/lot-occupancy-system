import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { getLotTypeFields } from "./getLotTypeFields.js";

import type * as recordTypes from "../../types/recordTypes";

export const getLotTypes = (): recordTypes.LotType[] => {
    const database = sqlite(databasePath);

    const lotTypes: recordTypes.LotType[] = database
        .prepare(
            "select lotTypeId, lotType, orderNumber" +
                " from LotTypes" +
                " where recordDelete_timeMillis is null" +
                " order by orderNumber, lotType"
        )
        .all();

        let expectedTypeOrderNumber = -1;

        for (const lotType of lotTypes) {
            expectedTypeOrderNumber += 1;
    
            if (lotType.orderNumber !== expectedTypeOrderNumber) {
                database
                    .prepare(
                        "update LotTypes set orderNumber = ? where lotTypeId = ?"
                    )
                    .run(expectedTypeOrderNumber, lotType.lotTypeId);
    
                lotType.orderNumber = expectedTypeOrderNumber;
            }
    
            lotType.lotTypeFields = getLotTypeFields(
                lotType.lotTypeId,
                database
            );
    
            let expectedFieldOrderNumber = -1;
    
            for (const lotTypeField of lotType.lotTypeFields) {
                expectedFieldOrderNumber += 1;
    
                if (lotTypeField.orderNumber !== expectedFieldOrderNumber) {
                    database
                        .prepare(
                            "update LotTypeFields" +
                                " set orderNumber = ?" +
                                " where lotTypeFieldId = ?"
                        )
                        .run(expectedFieldOrderNumber, lotTypeField.lotTypeFieldId);
    
                    lotTypeField.orderNumber = expectedFieldOrderNumber;
                }
            }
        }

    database.close();

    return lotTypes;
};

export default getLotTypes;
