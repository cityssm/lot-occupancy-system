import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export function getLotStatuses(): recordTypes.LotStatus[] {
    const database = sqlite(databasePath);

    const lotStatuses: recordTypes.LotStatus[] = database
        .prepare(
            `select lotStatusId, lotStatus, orderNumber
                from LotStatuses
                where recordDelete_timeMillis is null
                order by orderNumber, lotStatus`
        )
        .all();

    let expectedOrderNumber = 0;

    for (const lotStatus of lotStatuses) {
        if (lotStatus.orderNumber !== expectedOrderNumber) {
            database
                .prepare(
                    `update LotStatuses
                        set orderNumber = ?
                        where lotStatusId = ?`
                )
                .run(expectedOrderNumber, lotStatus.lotStatusId);

            lotStatus.orderNumber = expectedOrderNumber;
        }

        expectedOrderNumber += 1;
    }

    database.close();

    return lotStatuses;
}

export default getLotStatuses;
