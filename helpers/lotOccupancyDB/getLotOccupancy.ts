import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { dateIntegerToString } from "@cityssm/expressjs-server-js/dateTimeFns.js";

import { getLotOccupancyOccupants } from "./getLotOccupancyOccupants.js";

import { getLotOccupancyComments } from "./getLotOccupancyComments.js";

import { getLotOccupancyFields } from "./getLotOccupancyFields.js";

import { getLotOccupancyFees } from "./getLotOccupancyFees.js";

import { getLotOccupancyTransactions } from "./getLotOccupancyTransactions.js";

import { getWorkOrders } from "./getWorkOrders.js";

import type * as recordTypes from "../../types/recordTypes";

export const getLotOccupancy = (
    lotOccupancyId: number | string,
    connectedDatabase?: sqlite.Database
): recordTypes.LotOccupancy => {
    const database =
        connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });

    database.function("userFn_dateIntegerToString", dateIntegerToString);

    const lotOccupancy: recordTypes.LotOccupancy = database
        .prepare(
            "select o.lotOccupancyId," +
                " o.occupancyTypeId, t.occupancyType," +
                " o.lotId, l.lotName, l.lotTypeId," +
                " l.mapId, m.mapName," +
                " o.occupancyStartDate, userFn_dateIntegerToString(o.occupancyStartDate) as occupancyStartDateString," +
                " o.occupancyEndDate,  userFn_dateIntegerToString(o.occupancyEndDate) as occupancyEndDateString," +
                " o.recordUpdate_timeMillis" +
                " from LotOccupancies o" +
                " left join OccupancyTypes t on o.occupancyTypeId = t.occupancyTypeId" +
                " left join Lots l on o.lotId = l.lotId" +
                " left join Maps m on l.mapId = m.mapId" +
                " where o.recordDelete_timeMillis is null" +
                " and o.lotOccupancyId = ?"
        )
        .get(lotOccupancyId);

    if (lotOccupancy) {
        lotOccupancy.lotOccupancyFields = getLotOccupancyFields(lotOccupancyId, database);
        lotOccupancy.lotOccupancyOccupants = getLotOccupancyOccupants(lotOccupancyId, database);
        lotOccupancy.lotOccupancyComments = getLotOccupancyComments(lotOccupancyId, database);
        lotOccupancy.lotOccupancyFees = getLotOccupancyFees(lotOccupancyId, database);
        lotOccupancy.lotOccupancyTransactions = getLotOccupancyTransactions(
            lotOccupancyId,
            database
        );

        lotOccupancy.workOrders = getWorkOrders(
            {
                lotOccupancyId
            },
            {
                limit: -1,
                offset: 0
            },
            database
        ).workOrders;
    }

    if (!connectedDatabase) {
        database.close();
    }

    return lotOccupancy;
};

export default getLotOccupancy;
