import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

interface GetFilters {
    mapId?: number | string;
}

interface LotStatusSummary extends recordTypes.LotStatus {
    lotCount: number;
}

export function getLotStatusSummary(filters?: GetFilters): LotStatusSummary[] {
    const database = sqlite(databasePath, {
        readonly: true
    });

    let sqlWhereClause = " where l.recordDelete_timeMillis is null";
    const sqlParameters: unknown[] = [];

    if (filters && filters.mapId) {
        sqlWhereClause += " and l.mapId = ?";
        sqlParameters.push(filters.mapId);
    }

    const lotStatuses: LotStatusSummary[] = database
        .prepare(
            "select s.lotStatusId, s.lotStatus, count(l.lotId) as lotCount" +
                " from Lots l" +
                " left join LotStatuses s on l.lotStatusId = s.lotStatusId" +
                sqlWhereClause +
                " group by s.lotStatusId, s.lotStatus, s.orderNumber" +
                " order by s.orderNumber"
        )
        .all(sqlParameters);

    database.close();

    return lotStatuses;
}

export default getLotStatusSummary;
