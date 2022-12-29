import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { getLotOccupancy } from "./getLotOccupancy.js";
import { addLotOccupancy } from "./addLotOccupancy.js";
import { addLotOccupancyOccupant } from "./addLotOccupancyOccupant.js";

import { dateToString } from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";

export function copyLotOccupancy(
    oldLotOccupancyId: number | string,
    requestSession: recordTypes.PartialSession
): number {
    const database = sqlite(databasePath);

    const oldLotOccupancy = getLotOccupancy(oldLotOccupancyId, database);

    const newLotOccupancyId = addLotOccupancy(
        {
            lotId: oldLotOccupancy.lotId || "",
            occupancyTypeId: oldLotOccupancy.occupancyTypeId,
            occupancyStartDateString: dateToString(new Date()),
            occupancyEndDateString: ""
        },
        requestSession,
        database
    );

    /*
     * Copy Fields
     */

    const rightNowMillis = Date.now();

    for (const occupancyField of oldLotOccupancy.lotOccupancyFields) {
        database
            .prepare(
                `insert into LotOccupancyFields (
                    lotOccupancyId, occupancyTypeFieldId, lotOccupancyFieldValue,
                    recordCreate_userName, recordCreate_timeMillis,
                    recordUpdate_userName, recordUpdate_timeMillis)
                    values (?, ?, ?, ?, ?, ?, ?)`
            )
            .run(
                newLotOccupancyId,
                occupancyField.occupancyTypeFieldId,
                occupancyField.lotOccupancyFieldValue,
                requestSession.user.userName,
                rightNowMillis,
                requestSession.user.userName,
                rightNowMillis
            );
    }

    /*
     * Copy Occupants
     */

    for (const occupant of oldLotOccupancy.lotOccupancyOccupants) {
        addLotOccupancyOccupant(
            {
                lotOccupancyId: newLotOccupancyId,
                lotOccupantTypeId: occupant.lotOccupantTypeId,
                occupantName: occupant.occupantName,
                occupantAddress1: occupant.occupantAddress1,
                occupantAddress2: occupant.occupantAddress2,
                occupantCity: occupant.occupantCity,
                occupantProvince: occupant.occupantProvince,
                occupantPostalCode: occupant.occupantPostalCode,
                occupantPhoneNumber: occupant.occupantPhoneNumber,
                occupantEmailAddress: occupant.occupantEmailAddress
            },
            requestSession,
            database
        );
    }

    database.close();

    return newLotOccupancyId;
}

export default copyLotOccupancy;
