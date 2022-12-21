import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { getLotFields } from "./getLotFields.js";

import { getLotComments } from "./getLotComments.js";

import { getLotOccupancies } from "./getLotOccupancies.js";

import type * as recordTypes from "../../types/recordTypes";

const baseSQL =
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
    " where  l.recordDelete_timeMillis is null";

const _getLot = (sql: string, lotId_or_lotName: number | string): recordTypes.Lot | undefined => {
    const database = sqlite(databasePath, {
        readonly: true
    });

    const lot: recordTypes.Lot = database.prepare(sql).get(lotId_or_lotName);

    if (lot) {
        lot.lotOccupancies = getLotOccupancies(
            {
                lotId: lot.lotId
            },
            {
                includeOccupants: true,
                limit: -1,
                offset: 0
            },
            database
        ).lotOccupancies;

        lot.lotFields = getLotFields(lot.lotId, database);

        lot.lotComments = getLotComments(lot.lotId, database);
    }

    database.close();

    return lot;
};

export const getLotByLotName = (lotName: string): recordTypes.Lot | undefined => {
    return _getLot(baseSQL + " and l.lotName = ?", lotName);
};

export const getLot = (lotId: number | string): recordTypes.Lot => {
    return _getLot(baseSQL + " and l.lotId = ?", lotId);
};

export default getLot;
