import sqlite from "better-sqlite3";

import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import {
    clearWorkOrderTypesCache
} from "../functions.cache.js";


export const moveWorkOrderTypeDown =
    (workOrderTypeId: number | string): boolean => {

        const database = sqlite(databasePath);

        const currentOrderNumber: number = database.prepare("select orderNumber" +
                " from WorkOrderTypes" +
                " where workOrderTypeId = ?")
            .get(workOrderTypeId)
            .orderNumber;

        database
            .prepare("update WorkOrderTypes" +
                " set orderNumber = orderNumber - 1" +
                " where recordDelete_timeMillis is null" +
                " and orderNumber = ? + 1")
            .run(currentOrderNumber);

        const result = database
            .prepare("update WorkOrderTypes" +
                " set orderNumber = ? + 1" +
                " where workOrderTypeId = ?")
            .run(currentOrderNumber, workOrderTypeId);

        database.close();

        clearWorkOrderTypesCache();

        return result.changes > 0;
    };


export default moveWorkOrderTypeDown;