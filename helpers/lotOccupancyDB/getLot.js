import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { getLotComments } from "./getLotComments.js";
import { getLotOccupancies } from "./getLotOccupancies.js";
const baseSQL = "select l.lotId," +
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
const _getLot = (sql, lotId_or_lotName) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const lot = database.prepare(sql).get(lotId_or_lotName);
    if (lot) {
        lot.lotOccupancies = getLotOccupancies({
            lotId: lot.lotId
        }, {
            includeOccupants: true,
            limit: -1,
            offset: 0
        }, database).lotOccupancies;
        lot.lotComments = getLotComments(lot.lotId);
    }
    database.close();
    return lot;
};
export const getLotByLotName = (lotName) => {
    return _getLot(baseSQL + " and l.lotName = ?", lotName);
};
export const getLot = (lotId) => {
    return _getLot(baseSQL + " and l.lotId = ?", lotId);
};
export default getLot;
