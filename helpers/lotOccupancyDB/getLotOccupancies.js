import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { dateIntegerToString, dateStringToInteger, dateToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { getLotOccupancyOccupants } from "./getLotOccupancyOccupants.js";
export const getLotOccupancies = (filters, options, connectedDatabase) => {
    const database = connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });
    database.function("userFn_dateIntegerToString", dateIntegerToString);
    let sqlWhereClause = " where o.recordDelete_timeMillis is null";
    const sqlParameters = [];
    if (filters.lotId) {
        sqlWhereClause += " and o.lotId = ?";
        sqlParameters.push(filters.lotId);
    }
    if (filters.lotName) {
        const lotNamePieces = filters.lotName.toLowerCase().split(" ");
        for (const lotNamePiece of lotNamePieces) {
            sqlWhereClause += " and instr(lower(l.lotName), ?)";
            sqlParameters.push(lotNamePiece);
        }
    }
    if (filters.occupantName) {
        const occupantNamePieces = filters.occupantName
            .toLowerCase()
            .split(" ");
        for (const occupantNamePiece of occupantNamePieces) {
            sqlWhereClause +=
                " and o.lotOccupancyId in (select oo.lotOccupancyId from LotOccupancyOccupants oo where oo.recordDelete_timeMillis is null and instr(lower(oo.occupantName), ?))";
            sqlParameters.push(occupantNamePiece);
        }
    }
    if (filters.occupancyTypeId) {
        sqlWhereClause += " and o.occupancyTypeId = ?";
        sqlParameters.push(filters.occupancyTypeId);
    }
    if (filters.occupancyTime) {
        const currentDateString = dateToInteger(new Date());
        switch (filters.occupancyTime) {
            case "current":
                sqlWhereClause +=
                    " and o.occupancyStartDate <= ? and (o.occupancyEndDate is null or o.occupancyEndDate >= ?)";
                sqlParameters.push(currentDateString, currentDateString);
                break;
            case "past":
                sqlWhereClause += " and o.occupancyEndDate < ?";
                sqlParameters.push(currentDateString);
                break;
            case "future":
                sqlWhereClause += " and o.occupancyStartDate > ?";
                sqlParameters.push(currentDateString);
                break;
        }
    }
    if (filters.occupancyStartDateString) {
        sqlWhereClause += " and o.occupancyStartDate = ?";
        sqlParameters.push(dateStringToInteger(filters.occupancyStartDateString));
    }
    if (filters.occupancyEffectiveDateString) {
        sqlWhereClause +=
            " and (o.occupancyStartDate <= ? and (o.occupancyEndDate is null or o.occupancyEndDate >= ?))";
        sqlParameters.push(dateStringToInteger(filters.occupancyEffectiveDateString), dateStringToInteger(filters.occupancyEffectiveDateString));
    }
    if (filters.mapId) {
        sqlWhereClause += " and l.mapId = ?";
        sqlParameters.push(filters.mapId);
    }
    if (filters.lotTypeId) {
        sqlWhereClause += " and l.lotTypeId = ?";
        sqlParameters.push(filters.lotTypeId);
    }
    if (filters.workOrderId) {
        sqlWhereClause +=
            " and o.lotOccupancyId in (select lotOccupancyId from WorkOrderLotOccupancies where recordDelete_timeMillis is null and workOrderId = ?)";
        sqlParameters.push(filters.workOrderId);
    }
    if (filters.notWorkOrderId) {
        sqlWhereClause +=
            " and o.lotOccupancyId not in (select lotOccupancyId from WorkOrderLotOccupancies where recordDelete_timeMillis is null and workOrderId = ?)";
        sqlParameters.push(filters.notWorkOrderId);
    }
    const count = database
        .prepare("select count(*) as recordCount" +
        " from LotOccupancies o" +
        " left join Lots l on o.lotId = l.lotId" +
        sqlWhereClause)
        .get(sqlParameters).recordCount;
    let lotOccupancies = [];
    if (count > 0) {
        lotOccupancies = database
            .prepare("select o.lotOccupancyId," +
            " o.occupancyTypeId, t.occupancyType," +
            " o.lotId, l.lotName," +
            " l.mapId, m.mapName," +
            " o.occupancyStartDate, userFn_dateIntegerToString(o.occupancyStartDate) as occupancyStartDateString," +
            " o.occupancyEndDate,  userFn_dateIntegerToString(o.occupancyEndDate) as occupancyEndDateString" +
            " from LotOccupancies o" +
            " left join OccupancyTypes t on o.occupancyTypeId = t.occupancyTypeId" +
            " left join Lots l on o.lotId = l.lotId" +
            " left join Maps m on l.mapId = m.mapId" +
            sqlWhereClause +
            " order by o.occupancyStartDate desc, ifnull(o.occupancyEndDate, 99999999) desc, l.lotName, o.lotId" +
            (options.limit !== -1
                ? " limit " +
                    options.limit +
                    " offset " +
                    options.offset
                : ""))
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
