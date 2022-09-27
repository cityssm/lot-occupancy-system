import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

interface GetFilters {
    mapId?: number | string;
}

interface LotTypeSummary extends recordTypes.LotType {
    lotCount: number;
}

export const getLotTypeSummary = (filters?: GetFilters): LotTypeSummary[] => {
    const database = sqlite(databasePath, {
        readonly: true
    });

    let sqlWhereClause = " where l.recordDelete_timeMillis is null";
    const sqlParameters = [];

    if (filters && filters.mapId) {
        sqlWhereClause += " and l.mapId = ?";
        sqlParameters.push(filters.mapId);
    }

    const lotTypes: LotTypeSummary[] = database
        .prepare(
            "select t.lotTypeId, t.lotType, count(l.lotId) as lotCount" +
                " from Lots l" +
                " left join LotTypes t on l.lotTypeId = t.lotTypeId" +
                sqlWhereClause +
                " group by t.lotTypeId, t.lotType, t.orderNumber" +
                " order by t.orderNumber"
        )
        .all(sqlParameters);

    database.close();

    return lotTypes;
};

export default getLotTypeSummary;
