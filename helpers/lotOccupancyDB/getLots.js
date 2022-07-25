import { dateToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getLots = (filters, options) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    let sqlWhereClause = " where l.recordDelete_timeMillis is null";
    const sqlParameters = [];
    if (filters.lotName) {
        const lotNamePieces = filters.lotName.toLowerCase().split(" ");
        for (const lotNamePiece of lotNamePieces) {
            sqlWhereClause += " and instr(lower(l.lotName), ?)";
            sqlParameters.push(lotNamePiece);
        }
    }
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
    const count = database.prepare("select count(*) as recordCount" +
        " from Lots l" +
        sqlWhereClause)
        .get(sqlParameters)
        .recordCount;
    let lots = [];
    if (count > 0) {
        const currentDate = dateToInteger(new Date());
        lots = database
            .prepare("select l.lotId, l.lotName," +
            " t.lotType," +
            " l.mapId, m.mapName, l.mapKey," +
            " s.lotStatus," +
            " ifnull(o.lotOccupancyCount, 0) as lotOccupancyCount" +
            " from Lots l" +
            " left join LotTypes t on l.lotTypeId = t.lotTypeId" +
            " left join LotStatuses s on l.lotStatusId = s.lotStatusId" +
            " left join Maps m on l.mapId = m.mapId" +
            (" left join (" +
                "select lotId, count(lotOccupancyId) as lotOccupancyCount" +
                " from LotOccupancies" +
                " where recordDelete_timeMillis is null" +
                " and occupancyStartDate <= " + currentDate +
                " and (occupancyEndDate is null or occupancyEndDate >= " + currentDate + ")" +
                " group by lotId" +
                ") o on l.lotId = o.lotId") +
            sqlWhereClause +
            " order by l.lotName, l.lotId" +
            (options ?
                " limit " + options.limit + " offset " + options.offset :
                ""))
            .all(sqlParameters);
    }
    database.close();
    return {
        count,
        lots
    };
};
export default getLots;
