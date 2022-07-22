import sqlite from "better-sqlite3";
import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


interface GetLotOccupanciesFilters {
    lotId ? : number | string;
}


interface GetLotOccupanciesOptions {
    limit: number;
    offset: number;
}


export const getLotOccupancies = (filters: GetLotOccupanciesFilters, options ? : GetLotOccupanciesOptions): {
    count: number;
    lotOccupancies: recordTypes.LotOccupancy[];
} => {

    const database = sqlite(databasePath, {
        readonly: true
    });

    let sqlWhereClause = " where o.recordDelete_timeMillis is null";
    const sqlParameters = [];

    if (filters.lotId) {
        sqlWhereClause += " and o.lotId = ?";
        sqlParameters.push(filters.lotId);
    }

    const count: number = database.prepare("select count(*) as recordCount" +
            " from LotOccupancies o" +
            sqlWhereClause)
        .get(sqlParameters)
        .recordCount;

    let lotOccupancies: recordTypes.LotOccupancy[] = [];

    if (count > 0) {

        lotOccupancies = database
            .prepare("select o.lotOccupancyId," +
                " o.occupancyTypeId, t.occupancyType," +
                " o.lotId, l.lotName," +
                " o.occupantId, n.occupantName," +
                " o.occupancyStartDate," +
                " o.occupancyEndDate" +
                " from LotOccupancies o" +
                " left join OccupancyTypes t on o.occupancyTypeId = t.occupancyTypeId" +
                " left join Lots l on o.lotId = l.lotId" +
                " left join Occupants n on o.occupantId = n.occupantId" +
                sqlWhereClause +
                " order by o.occupancyStartDate, o.occupancyEndDate, l.lotName, o.lotId" +
                (options ?
                    " limit " + options.limit + " offset " + options.offset :
                    ""))
            .all(sqlParameters);
    }

    database.close();

    return {
        count,
        lotOccupancies
    };
};


export default getLotOccupancies;