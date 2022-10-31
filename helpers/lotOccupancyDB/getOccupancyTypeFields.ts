import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export const getOccupancyTypeFields = (
    occupancyTypeId?: number,
    connectedDatabase?: sqlite.Database
): recordTypes.OccupancyTypeField[] => {
    const database = connectedDatabase || sqlite(databasePath);

    const sqlParameters: unknown[] = [];

    if (occupancyTypeId) {
        sqlParameters.push(occupancyTypeId);
    }

    const occupancyTypeFields: recordTypes.OccupancyTypeField[] = database
        .prepare(
            "select occupancyTypeFieldId," +
                " occupancyTypeField, occupancyTypeFieldValues, isRequired, pattern," +
                " minimumLength, maximumLength," +
                " orderNumber" +
                " from OccupancyTypeFields" +
                " where recordDelete_timeMillis is null" +
                (occupancyTypeId ? " and occupancyTypeId = ?" : " and occupancyTypeId is null") +
                " order by orderNumber, occupancyTypeField"
        )
        .all(sqlParameters);

    let expectedFieldOrderNumber = -1;

    for (const occupancyTypeField of occupancyTypeFields) {
        expectedFieldOrderNumber += 1;

        if (occupancyTypeField.orderNumber !== expectedFieldOrderNumber) {
            database
                .prepare(
                    "update OccupancyTypeFields" +
                        " set orderNumber = ?" +
                        " where occupancyTypeFieldId = ?"
                )
                .run(expectedFieldOrderNumber, occupancyTypeField.occupancyTypeFieldId);

            occupancyTypeField.orderNumber = expectedFieldOrderNumber;
        }
    }

    if (!connectedDatabase) {
        database.close();
    }

    return occupancyTypeFields;
};

export default getOccupancyTypeFields;
