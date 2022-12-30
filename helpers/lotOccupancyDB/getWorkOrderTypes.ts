import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export function getWorkOrderTypes(): recordTypes.WorkOrderType[] {
    const database = sqlite(databasePath);

    const workOrderTypes: recordTypes.WorkOrderType[] = database
        .prepare(
            `select workOrderTypeId, workOrderType, orderNumber
                from WorkOrderTypes
                where recordDelete_timeMillis is null
                order by orderNumber, workOrderType`
        )
        .all();

    let expectedOrderNumber = 0;

    for (const workOrderType of workOrderTypes) {
        if (workOrderType.orderNumber !== expectedOrderNumber) {
            database
                .prepare(`update WorkOrderTypes set orderNumber = ? where workOrderTypeId = ?`)
                .run(expectedOrderNumber, workOrderType.workOrderTypeId);

            workOrderType.orderNumber = expectedOrderNumber;
        }

        expectedOrderNumber += 1;
    }

    database.close();

    return workOrderTypes;
}

export default getWorkOrderTypes;
