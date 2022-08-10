import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const getLotStatuses = (): recordTypes.LotStatus[] => {

    const database = sqlite(databasePath, {
        readonly: true
    });

    const lotStatuses: recordTypes.LotStatus[] = database
      .prepare("select lotStatusId, lotStatus" +
        " from LotStatuses" +
        " where recordDelete_timeMillis is null" +
        " order by orderNumber, lotStatus")
      .all();

    database.close();

    return lotStatuses;
  };


export default getLotStatuses;