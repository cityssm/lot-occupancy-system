import { dateStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


interface UpdateLotOccupancyForm {
    lotOccupancyId: string | number;
    occupancyTypeId: string | number;
    lotId: string | number;

    occupancyStartDateString: string;
    occupancyEndDateString: string;
}


export function updateLotOccupancy(lotOccupancyForm: UpdateLotOccupancyForm, requestSession: recordTypes.PartialSession): boolean {

    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare("update LotOccupancies" +
            " set occupancyTypeId = ?," +
            " lotId = ?," +
            " occupancyStartDate = ?," +
            " occupancyEndDate = ?," +
            " recordUpdate_userName = ?," +
            " recordUpdate_timeMillis = ?" +
            " where lotOccupancyId = ?" +
            " and recordDelete_timeMillis is null")
        .run(lotOccupancyForm.occupancyTypeId,
            (lotOccupancyForm.lotId === "" ? undefined : lotOccupancyForm.lotId),
            dateStringToInteger(lotOccupancyForm.occupancyStartDateString),
            (lotOccupancyForm.occupancyEndDateString === "" ? undefined : dateStringToInteger(lotOccupancyForm.occupancyEndDateString)),
            requestSession.user.userName,
            rightNowMillis,
            lotOccupancyForm.lotOccupancyId);

    database.close();

    return result.changes > 0;
}


export default updateLotOccupancy;