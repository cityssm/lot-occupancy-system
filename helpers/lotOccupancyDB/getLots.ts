import sqlite from "better-sqlite3";
import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


interface GetLotsFilters {
    mapId?: number | string;
    lotTypeId?: number | string;
    lotStatusId?: number | string;
}

interface GetLotsOptions {
    limit: number;
    offset: number;
}


export const getLots = (filters ? : GetLotsFilters, options?: GetLotsOptions): recordTypes.Lot[] => {

    const database = sqlite(databasePath, {
        readonly: true
    });

    let sqlWhereClause = "";
    const sqlParameters = [];

    if (filters.mapId) {
        sqlWhereClause += " and l.mapId = ?";
        sqlParameters.push(filters.mapId);
    }

    if (filters.lotTypeId) {
        sqlWhereClause += " and l.lotTypeId = ?";
        sqlParameters.push(filters.lotTypeId);
    }

    if (filters.lotStatusId) {
        sqlWhereClause += " and l.lotStatusId = ?";
        sqlParameters.push(filters.lotStatusId);
    }

    const lots: recordTypes.Lot[] = database
        .prepare("select l.lotId, l.lotName," +
        " t.lotType," +
        " m.mapName, l.mapKey," +
        " s.lotStatus" +
        " from Lots l" +
        " left join LotTypes t on l.lotTypeId = t.lotTypeId" +
        " left join LotStatuses s on l.lotStatusId = s.lotStatusId" +
        " left join Maps m on l.mapId = m.mapId" +
        " where l.recordDelete_timeMillis is null" +
        sqlWhereClause +
        " order by l.lotName" +
        (options
            ? " limit " + options.limit + " offset " + options.offset
            : ""))
        .all(sqlParameters);

    database.close();

    return lots;
};


export default getLots;