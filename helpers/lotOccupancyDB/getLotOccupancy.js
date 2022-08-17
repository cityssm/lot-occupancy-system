import { dateIntegerToString } from "@cityssm/expressjs-server-js/dateTimeFns.js";
import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { getLotOccupancyOccupants } from "./getLotOccupancyOccupants.js";
import { getLotOccupancyComments } from "./getLotOccupancyComments.js";
import { getLotOccupancyFields } from "./getLotOccupancyFields.js";
import { getLotOccupancyFees } from "./getLotOccupancyFees.js";
import { getLotOccupancyTransactions } from "./getLotOccupancyTransactions.js";
export const getLotOccupancy = (lotOccupancyId) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    database.function("userFn_dateIntegerToString", dateIntegerToString);
    const lotOccupancy = database
        .prepare("select o.lotOccupancyId," +
        " o.occupancyTypeId, t.occupancyType," +
        " o.lotId, l.lotName, l.lotTypeId," +
        " l.mapId, m.mapName," +
        " o.occupancyStartDate, userFn_dateIntegerToString(o.occupancyStartDate) as occupancyStartDateString," +
        " o.occupancyEndDate,  userFn_dateIntegerToString(o.occupancyEndDate) as occupancyEndDateString" +
        " from LotOccupancies o" +
        " left join OccupancyTypes t on o.occupancyTypeId = t.occupancyTypeId" +
        " left join Lots l on o.lotId = l.lotId" +
        " left join Maps m on l.mapId = m.mapId" +
        " where o.recordDelete_timeMillis is null" +
        " and o.lotOccupancyId = ?")
        .get(lotOccupancyId);
    if (lotOccupancy) {
        lotOccupancy.lotOccupancyFields = getLotOccupancyFields(lotOccupancyId, database);
        lotOccupancy.lotOccupancyOccupants = getLotOccupancyOccupants(lotOccupancyId, database);
        lotOccupancy.lotOccupancyComments = getLotOccupancyComments(lotOccupancyId, database);
        lotOccupancy.lotOccupancyFees = getLotOccupancyFees(lotOccupancyId, database);
        lotOccupancy.lotOccupancyTransactions = getLotOccupancyTransactions(lotOccupancyId, database);
    }
    database.close();
    return lotOccupancy;
};
export default getLotOccupancy;
