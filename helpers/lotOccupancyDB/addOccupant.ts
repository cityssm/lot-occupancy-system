import sqlite from "better-sqlite3";
import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


interface AddOccupantForm {
    occupantName: string;
    occupantAddress1: string;
    occupantAddress2: string;
    occupantCity: string;
    occupantProvince: string;
    occupantPostalCode: string;
    occupantPhoneNumber: string;
}


export const addOccupant =
    (occupantForm: AddOccupantForm, requestSession: recordTypes.PartialSession, connectedDatabase ? : sqlite.Database): number => {

        const database = connectedDatabase || sqlite(databasePath);

        const rightNowMillis = Date.now();

        const result = database
            .prepare("insert into Occupants (" +
                "occupantName," +
                " occupantAddress1, occupantAddress2, occupantCity, occupantProvince, occupantPostalCode, occupantPhoneNumber," +
                " recordCreate_userName, recordCreate_timeMillis," +
                " recordUpdate_userName, recordUpdate_timeMillis)" +
                " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(occupantForm.occupantName,
                occupantForm.occupantAddress1,
                occupantForm.occupantAddress2,
                occupantForm.occupantCity,
                occupantForm.occupantProvince,
                occupantForm.occupantPostalCode,
                occupantForm.occupantPhoneNumber,
                requestSession.user.userName,
                rightNowMillis,
                requestSession.user.userName,
                rightNowMillis);

        if (!connectedDatabase) {
            database.close();
        }

        return result.lastInsertRowid as number;
    };


export default addOccupant;