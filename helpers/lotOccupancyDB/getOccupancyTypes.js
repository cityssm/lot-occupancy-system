import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getOccupancyTypes = () => {
    const database = sqlite(databasePath);
    const occupancyTypes = database
        .prepare("select occupancyTypeId, occupancyType, orderNumber" +
        " from OccupancyTypes" +
        " where recordDelete_timeMillis is null" +
        " order by orderNumber, occupancyType")
        .all();
    let expectedTypeOrderNumber = -1;
    for (const occupancyType of occupancyTypes) {
        expectedTypeOrderNumber += 1;
        if (occupancyType.orderNumber !== expectedTypeOrderNumber) {
            database
                .prepare("update OccupancyTypes" +
                " set orderNumber = ?" +
                " where occupancyTypeId = ?")
                .run(expectedTypeOrderNumber, occupancyType.occupancyTypeId);
            occupancyType.orderNumber = expectedTypeOrderNumber;
        }
        occupancyType.occupancyTypeFields = database
            .prepare("select occupancyTypeFieldId," +
            " occupancyTypeField, occupancyTypeFieldValues, isRequired, pattern," +
            " minimumLength, maximumLength," +
            " orderNumber" +
            " from OccupancyTypeFields" +
            " where recordDelete_timeMillis is null" +
            " and occupancyTypeId = ?" +
            " order by orderNumber, occupancyTypeField")
            .all(occupancyType.occupancyTypeId);
        let expectedFieldOrderNumber = -1;
        for (const occupancyTypeField of occupancyType.occupancyTypeFields) {
            expectedFieldOrderNumber += 1;
            if (occupancyTypeField.orderNumber !== expectedFieldOrderNumber) {
                database
                    .prepare("update OccupancyTypeFields" +
                    " set orderNumber = ?" +
                    " where occupancyTypeFieldId = ?")
                    .run(expectedFieldOrderNumber, occupancyTypeField.occupancyTypeFieldId);
                occupancyTypeField.orderNumber = expectedFieldOrderNumber;
            }
        }
    }
    database.close();
    return occupancyTypes;
};
export default getOccupancyTypes;
