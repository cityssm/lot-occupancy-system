import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const getLotTypes = (): recordTypes.LotType[] => {

    const database = sqlite(databasePath, {
        readonly: true
    });

    const lotTypes: recordTypes.LotType[] = database
      .prepare("select * from LotTypes" +
        " where recordDelete_timeMillis is null" +
        " order by orderNumber, lotType")
      .all();

    database.close();

    return lotTypes;
  };


export default getLotTypes;