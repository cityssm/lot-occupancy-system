import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearLotOccupantTypesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateLotOccupantTypeForm {
    lotOccupantTypeId: number | string;
    lotOccupantType: string;
}

export const updateLotOccupantType = (
    lotOccupantTypeForm: UpdateLotOccupantTypeForm,
    requestSession: recordTypes.PartialSession
): boolean => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "update LotOccupantTypes" +
                " set lotOccupantType = ?," +
                " recordUpdate_userName = ?," +
                " recordUpdate_timeMillis = ?" +
                " where lotOccupantTypeId = ?" +
                " and recordDelete_timeMillis is null"
        )
        .run(
            lotOccupantTypeForm.lotOccupantType,
            requestSession.user.userName,
            rightNowMillis,
            lotOccupantTypeForm.lotOccupantTypeId
        );

    database.close();

    clearLotOccupantTypesCache();

    return result.changes > 0;
};

export default updateLotOccupantType;
