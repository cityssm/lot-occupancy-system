import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

interface GetMapsFilters {}

export const getMaps = (filters?: GetMapsFilters): recordTypes.Map[] => {
    const database = sqlite(databasePath, {
        readonly: true
    });

    const maps: recordTypes.Map[] = database
        .prepare(
            "select m.mapId, m.mapName, m.mapDescription," +
                " m.mapLatitude, m.mapLongitude, m.mapSVG," +
                " m.mapAddress1, m.mapAddress2, m.mapCity, m.mapProvince, m.mapPostalCode, m.mapPhoneNumber," +
                " ifnull(l.lotCount,0) as lotCount" +
                " from Maps m" +
                (" left join (" +
                    "select mapId, count(lotId) as lotCount" +
                    " from Lots" +
                    " where recordDelete_timeMillis is null" +
                    " group by mapId) l on m.mapId = l.mapId") +
                " where m.recordDelete_timeMillis is null" +
                " order by m.mapName, m.mapId"
        )
        .all();

    database.close();

    return maps;
};

export default getMaps;
