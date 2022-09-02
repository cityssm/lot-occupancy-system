import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateLotForm {
    lotId: string | number;
    lotName: string;
    lotTypeId: string | number;
    lotStatusId: string | number;

    mapId: string | number;
    mapKey: string;

    lotLatitude: string;
    lotLongitude: string;
}

export function updateLot(
    lotForm: UpdateLotForm,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "update Lots" +
                " set lotName = ?," +
                " lotTypeId = ?," +
                " lotStatusId = ?," +
                " mapId = ?," +
                " mapKey = ?," +
                " lotLatitude = ?," +
                " lotLongitude = ?," +
                " recordUpdate_userName = ?," +
                " recordUpdate_timeMillis = ?" +
                " where lotId = ?" +
                " and recordDelete_timeMillis is null"
        )
        .run(
            lotForm.lotName,
            lotForm.lotTypeId,
            lotForm.lotStatusId === "" ? undefined : lotForm.lotStatusId,
            lotForm.mapId === "" ? undefined : lotForm.mapId,
            lotForm.mapKey,
            lotForm.lotLatitude === "" ? undefined : lotForm.lotLatitude,
            lotForm.lotLongitude === "" ? undefined : lotForm.lotLongitude,
            requestSession.user.userName,
            rightNowMillis,
            lotForm.lotId
        );

    database.close();

    return result.changes > 0;
}

export function updateLotStatus(
    lotId: number | string,
    lotStatusId: number | string,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "update Lots" +
                " set lotStatusId = ?," +
                " recordUpdate_userName = ?," +
                " recordUpdate_timeMillis = ?" +
                " where lotId = ?" +
                " and recordDelete_timeMillis is null"
        )
        .run(
            lotStatusId === "" ? undefined : lotStatusId,
            requestSession.user.userName,
            rightNowMillis,
            lotId
        );

    database.close();

    return result.changes > 0;
}

export default updateLot;
