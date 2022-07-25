import { dateIntegerToString } from "@cityssm/expressjs-server-js/dateTimeFns.js";
import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { getLotOccupancyOccupants } from "./getLotOccupancyOccupants.js";
export const getLotOccupancies = (filters, options, connectedDatabase) => {
    const database = connectedDatabase || sqlite(databasePath, {
        readonly: true
    });
    database.function("userFn_dateIntegerToString", dateIntegerToString);
    let sqlWhereClause = " where o.recordDelete_timeMillis is null";
    const sqlParameters = [];
    if (filters.lotId) {
        sqlWhereClause += " and o.lotId = ?";
        sqlParameters.push(filters.lotId);
    }
    const count = database.prepare("select count(*) as recordCount" +
        " from LotOccupancies o" +
        sqlWhereClause)
        .get(sqlParameters)
        .recordCount;
    let lotOccupancies = [];
    if (count > 0) {
        lotOccupancies = database
            .prepare("select o.lotOccupancyId," +
            " o.occupancyTypeId, t.occupancyType," +
            " o.lotId, l.lotName," +
            " o.occupancyStartDate, userFn_dateIntegerToString(o.occupancyStartDate) as occupancyStartDateString," +
            " o.occupancyEndDate,  userFn_dateIntegerToString(o.occupancyEndDate) as occupancyEndDateString" +
            " from LotOccupancies o" +
            " left join OccupancyTypes t on o.occupancyTypeId = t.occupancyTypeId" +
            " left join Lots l on o.lotId = l.lotId" +
            sqlWhereClause +
            " order by o.occupancyStartDate desc, ifnull(o.occupancyEndDate, 99999999) desc, l.lotName, o.lotId" +
            (options.limit !== -1 ?
                " limit " + options.limit + " offset " + options.offset :
                ""))
            .all(sqlParameters);
        if (options.includeOccupants) {
            for (const lotOccupancy of lotOccupancies) {
                lotOccupancy.lotOccupancyOccupants = getLotOccupancyOccupants(lotOccupancy.lotOccupancyId, database);
            }
        }
    }
    if (!connectedDatabase) {
        database.close();
    }
    return {
        count,
        lotOccupancies
    };
};
export default getLotOccupancies;
