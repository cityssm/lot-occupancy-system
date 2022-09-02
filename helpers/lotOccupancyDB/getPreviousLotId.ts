import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import * as configFunctions from "../functions.config.js";

export const getPreviousLotId = (lotId: number | string): number => {
    const database = sqlite(databasePath, {
        readonly: true
    });

    database.function(
        "userFn_lotNameSortName",
        configFunctions.getProperty("settings.lot.lotNameSortNameFunction")
    );

    const result: {
        lotId: number;
    } = database
        .prepare(
            "select lotId from Lots" +
                " where recordDelete_timeMillis is null" +
                " and userFn_lotNameSortName(lotName) < (select userFn_lotNameSortName(lotName) from Lots where lotId = ?)" +
                " order by userFn_lotNameSortName(lotName) desc" +
                " limit 1"
        )
        .get(lotId);

    database.close();

    if (result) {
        return result.lotId;
    }

    return undefined;
};

export default getPreviousLotId;
