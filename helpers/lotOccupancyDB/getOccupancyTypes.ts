import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const getOccupancyTypes = (): recordTypes.OccupancyType[] => {

    const database = sqlite(databasePath, {
        readonly: true
    });

    const occupancyTypes: recordTypes.OccupancyType[] = database
      .prepare("select * from OccupancyTypes" +
        " where recordDelete_timeMillis is null" +
        " order by orderNumber, occupancyType")
      .all();

    database.close();

    return occupancyTypes;
  };


export default getOccupancyTypes;