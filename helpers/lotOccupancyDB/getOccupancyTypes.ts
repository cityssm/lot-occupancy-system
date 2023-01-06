import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { getOccupancyTypeFields } from "./getOccupancyTypeFields.js";
import { getOccupancyTypePrints } from "./getOccupancyTypePrints.js";

import type * as recordTypes from "../../types/recordTypes";
import { updateRecordOrderNumber } from "./updateRecordOrderNumber.js";

export function getOccupancyTypes(): recordTypes.OccupancyType[] {
    const database = sqlite(databasePath);

    const occupancyTypes: recordTypes.OccupancyType[] = database
        .prepare(
            `select occupancyTypeId, occupancyType, orderNumber
                from OccupancyTypes
                where recordDelete_timeMillis is null
                order by orderNumber, occupancyType`
        )
        .all();

    let expectedTypeOrderNumber = -1;

    for (const occupancyType of occupancyTypes) {
        expectedTypeOrderNumber += 1;

        if (occupancyType.orderNumber !== expectedTypeOrderNumber) {
            updateRecordOrderNumber(
                "OccupancyTypes",
                occupancyType.occupancyTypeId,
                expectedTypeOrderNumber,
                database
            );

            occupancyType.orderNumber = expectedTypeOrderNumber;
        }

        occupancyType.occupancyTypeFields = getOccupancyTypeFields(occupancyType.occupancyTypeId, database);

        occupancyType.occupancyTypePrints = getOccupancyTypePrints(occupancyType.occupancyTypeId, database);
    }

    database.close();

    return occupancyTypes;
}

export default getOccupancyTypes;
