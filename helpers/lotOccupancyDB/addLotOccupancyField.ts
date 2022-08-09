import sqlite from "better-sqlite3";

import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


interface AddLotOccupancyFieldForm {
    lotOccupancyId: string | number;
    occupancyTypeFieldId: string | number;
    lotOccupancyFieldValue: string;
}


export const addLotOccupancyField =
    (lotOccupancyFieldForm: AddLotOccupancyFieldForm, requestSession: recordTypes.PartialSession): boolean => {

        const database = sqlite(databasePath);

        const rightNowMillis = Date.now();

        let success = true;

        try {
            database
                .prepare("insert into LotOccupancyFields (" +
                    "lotOccupancyId, occupancyTypeFieldId," +
                    " lotOccupancyFieldValue," +
                    " recordCreate_userName, recordCreate_timeMillis," +
                    " recordUpdate_userName, recordUpdate_timeMillis)" +
                    " values (?, ?, ?, ?, ?, ?, ?)")
                .run(lotOccupancyFieldForm.lotOccupancyId,
                    lotOccupancyFieldForm.occupancyTypeFieldId,
                    lotOccupancyFieldForm.lotOccupancyFieldValue,
                    requestSession.user.userName,
                    rightNowMillis,
                    requestSession.user.userName,
                    rightNowMillis);
        } catch {
            success = false;
        } finally {
            database.close();
        }

        return success;
    };


export default addLotOccupancyField;