import sqlite from "better-sqlite3";

import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


interface AddLotOccupancyOccupantForm {
    lotOccupancyId: string | number;
    lotOccupantTypeId: string | number;
    occupantName: string;
    occupantAddress1: string;
    occupantAddress2: string;
    occupantCity: string;
    occupantProvince: string;
    occupantPostalCode: string;
    occupantPhoneNumber: string;
}


export const addLotOccupancyOccupant =
    (lotOccupancyOccupantForm: AddLotOccupancyOccupantForm, requestSession: recordTypes.PartialSession): number => {

        const database = sqlite(databasePath);

        let lotOccupantIndex = 0;

        const maxIndexResult = database.prepare("select lotOccupantIndex" +
                " from LotOccupancyOccupants" +
                " where lotOccupancyId = ?" +
                " order by lotOccupantIndex" +
                " limit 1")
            .get(lotOccupancyOccupantForm.lotOccupancyId);

        if (maxIndexResult) {
            lotOccupantIndex = maxIndexResult.lotOccupantIndex + 1;
        }

        const rightNowMillis = Date.now();

        database
            .prepare("insert into LotOccupancyOccupants (" +
                "lotOccupancyId, lotOccupantIndex," +
                " occupantName," +
                " occupantAddress1, occupantAddress2," +
                " occupantCity, occupantProvince, occupantPostalCode," +
                " occupantPhoneNumber," +
                " lotOccupantTypeId," +
                " recordCreate_userName, recordCreate_timeMillis," +
                " recordUpdate_userName, recordUpdate_timeMillis)" +
                " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(lotOccupancyOccupantForm.lotOccupancyId,
                lotOccupantIndex,
                lotOccupancyOccupantForm.occupantName,
                lotOccupancyOccupantForm.occupantAddress1,
                lotOccupancyOccupantForm.occupantAddress2,
                lotOccupancyOccupantForm.occupantCity,
                lotOccupancyOccupantForm.occupantProvince,
                lotOccupancyOccupantForm.occupantPostalCode,
                lotOccupancyOccupantForm.occupantPhoneNumber,
                lotOccupancyOccupantForm.lotOccupantTypeId,
                requestSession.user.userName,
                rightNowMillis,
                requestSession.user.userName,
                rightNowMillis);

        database.close();

        return lotOccupantIndex;
    };


export default addLotOccupancyOccupant;