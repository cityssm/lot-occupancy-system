import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearCacheByTableName } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

type RecordTable =
    | "FeeCategories"
    | "LotStatuses"
    | "LotTypes"
    | "OccupancyTypes"
    | "WorkOrderMilestoneTypes"
    | "WorkOrderTypes";

const recordNameIdColumns: Map<RecordTable, string[]> = new Map();
recordNameIdColumns.set("FeeCategories", ["feeCategory", "feeCategoryId"]);
recordNameIdColumns.set("LotStatuses", ["lotStatus", "lotStatusId"]);
recordNameIdColumns.set("LotTypes", ["lotType", "lotTypeId"]);
recordNameIdColumns.set("OccupancyTypes", ["occupancyType", "occupancyTypeId"]);
recordNameIdColumns.set("WorkOrderMilestoneTypes", ["workOrderMilestoneType", "workOrderMilestoneTypeId"]);
recordNameIdColumns.set("WorkOrderTypes", ["workOrderType", "workOrderTypeId"]);

export function updateRecord(
    recordTable: RecordTable,
    recordId: number | string,
    recordName: string,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `update ${recordTable}
                set ${recordNameIdColumns.get(recordTable)[0]} = ?,
                recordUpdate_userName = ?,
                recordUpdate_timeMillis = ?
                where recordDelete_timeMillis is null
                and ${recordNameIdColumns.get(recordTable)[1]} = ?`
        )
        .run(recordName, requestSession.user.userName, rightNowMillis, recordId);

    database.close();

    clearCacheByTableName(recordTable);

    return result.changes > 0;
}
