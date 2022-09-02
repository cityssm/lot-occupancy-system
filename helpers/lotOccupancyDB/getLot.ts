import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { getLotComments } from "./getLotComments.js";

import { getLotOccupancies } from "./getLotOccupancies.js";

import type * as recordTypes from "../../types/recordTypes";

export const getLot = (lotId: number | string): recordTypes.Lot => {
    const database = sqlite(databasePath, {
        readonly: true
    });

    const lot: recordTypes.Lot = database
        .prepare(
            "select l.lotId," +
                " l.lotTypeId, t.lotType," +
                " l.lotName," +
                " l.lotStatusId, s.lotStatus," +
                " l.mapId, m.mapName, m.mapSVG, l.mapKey," +
                " l.lotLatitude, l.lotLongitude" +
                " from Lots l" +
                " left join LotTypes t on l.lotTypeId = t.lotTypeId" +
                " left join LotStatuses s on l.lotStatusId = s.lotStatusId" +
                " left join Maps m on l.mapId = m.mapId" +
                " where  l.recordDelete_timeMillis is null" +
                " and l.lotId = ?"
        )
        .get(lotId);

    if (lot) {
        lot.lotOccupancies = getLotOccupancies(
            {
                lotId
            },
            {
                includeOccupants: true,
                limit: -1,
                offset: 0
            },
            database
        ).lotOccupancies;

        lot.lotComments = getLotComments(lotId);
    }

    database.close();

    return lot;
};

export default getLot;
