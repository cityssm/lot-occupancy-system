import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const getLotOccupantTypes = (): recordTypes.LotOccupantType[] => {

    const database = sqlite(databasePath, {
        readonly: true
    });

    const lotOccupantTypes: recordTypes.LotOccupantType[] = database
      .prepare("select * from LotOccupantTypes" +
        " where recordDelete_timeMillis is null" +
        " order by orderNumber, lotOccupantType")
      .all();

    database.close();

    return lotOccupantTypes;
  };


export default getLotOccupantTypes;