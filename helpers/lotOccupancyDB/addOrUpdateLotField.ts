import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

interface LotFieldForm {
    lotId: string | number;
    lotTypeFieldId: string | number;
    lotFieldValue: string;
}

export const addOrUpdateLotField = (
    lotFieldForm: LotFieldForm,
    requestSession: recordTypes.PartialSession,
    connectedDatabase?: sqlite.Database
): boolean => {
    const database = connectedDatabase || sqlite(databasePath);

    const rightNowMillis = Date.now();

    let result = database
        .prepare(
            "update LotFields" +
                " set lotFieldValue = ?," +
                " recordUpdate_userName = ?," +
                " recordUpdate_timeMillis = ?," +
                " recordDelete_userName = null," +
                " recordDelete_timeMillis = null" +
                " where lotId = ?" +
                " and lotTypeFieldId = ?"
        )
        .run(
            lotFieldForm.lotFieldValue,
            requestSession.user.userName,
            rightNowMillis,
            lotFieldForm.lotId,
            lotFieldForm.lotTypeFieldId
        );

    if (result.changes === 0) {
        result = database
            .prepare(
                "insert into LotFields (" +
                    "lotId, lotTypeFieldId," +
                    " lotFieldValue," +
                    " recordCreate_userName, recordCreate_timeMillis," +
                    " recordUpdate_userName, recordUpdate_timeMillis)" +
                    " values (?, ?, ?, ?, ?, ?, ?)"
            )
            .run(
                lotFieldForm.lotId,
                lotFieldForm.lotTypeFieldId,
                lotFieldForm.lotFieldValue,
                requestSession.user.userName,
                rightNowMillis,
                requestSession.user.userName,
                rightNowMillis
            );
    }

    if (!connectedDatabase) {
        database.close();
    }

    return result.changes > 0;
};

export default addOrUpdateLotField;
