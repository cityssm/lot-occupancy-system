import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../data/databasePaths.js";

import debug from "debug";
const debugSQL = debug("lot-occupancy-system:databaseInitializer");


const recordColumns = " recordCreate_userName varchar(30) not null," +
  " recordCreate_timeMillis integer not null," +
  " recordUpdate_userName varchar(30) not null," +
  " recordUpdate_timeMillis integer not null," +
  " recordDelete_userName varchar(30)," +
  " recordDelete_timeMillis integer";

export const initLotsDB = (): boolean => {

  const lotOccupancyDB = sqlite(databasePath);

  const row = lotOccupancyDB
    .prepare("select name from sqlite_master where type = 'table' and name = 'Lots'")
    .get();

  if (!row) {

    debugSQL("Creating " + databasePath);

    // Contacts

    lotOccupancyDB.prepare("create table if not exists ContactTypes (" +
      "contactTypeId integer not null primary key autoincrement," +
      " contactType varchar(100) not null," +
      " isLotContactType bit not null default 0," +
      " isOccupantContactType bit not null default 0," +
      " orderNumber smallint not null default 0," +
      recordColumns +
      ")").run();

    lotOccupancyDB.prepare("create table if not exists Contacts (" +
      "contactId integer not null primary key autoincrement," +
      " contactTypeId integer not null," +
      " contactName varchar(200) not null," +
      " contactDescription text," +

      " contactLatitude  decimal(10, 8) check (contactLatitude  between  -90 and 90)," +
      " contactLongitude decimal(11, 8) check (contactLongitude between -180 and 180)," +

      " contactAddress1 varchar(50)," +
      " contactAddress2 varchar(50)," +
      " contactCity varchar(20)," +
      " contactProvince varchar(2)," +
      " contactPostalCode varchar(7)," +
      " contactPhoneNumber varchar(30)," +

      recordColumns + "," +
      " foreign key (contactTypeId) references ContactTypes (contactTypeId)" +
      ")").run();

    // Lot Types

    lotOccupancyDB.prepare("create table if not exists LotTypes (" +
      "lotTypeId integer not null primary key autoincrement," +
      " lotType varchar(100) not null," +
      " orderNumber smallint not null default 0," +
      recordColumns +
      ")").run();

    lotOccupancyDB.prepare("create table if not exists LotTypeFields (" +
      "lotTypeFieldId integer not null primary key autoincrement," +
      " lotTypeId integer not null," +
      " lotTypeField varchar(100) not null," +
      " lotTypeFieldValues text," +
      " isRequired bit not null default 0," +
      " pattern varchar(100)," +
      " minimumLength smallint not null default 1 check (minimumLength >= 0)," +
      " maximumLength smallint not null default 100 check (maximumLength >= 0)," +
      " orderNumber smallint not null default 0," +
      recordColumns + "," +
      " foreign key (lotTypeId) references LotTypes (lotTypeId)" +
      ")").run();

    lotOccupancyDB.prepare("create table if not exists LotTypeStatuses (" +
      "lotTypeStatusId integer not null primary key autoincrement," +
      " lotTypeId integer not null," +
      " lotTypeStatus varchar(100) not null," +
      " orderNumber smallint not null default 0," +
      recordColumns + "," +
      " foreign key (lotTypeId) references LotTypes (lotTypeId)" +
      ")").run();

    // Lots

    lotOccupancyDB.prepare("create table if not exists Lots (" +
      "lotId integer not null primary key autoincrement," +
      " lotTypeId integer not null," +
      " lotName varchar(100)," +
      " lotContactId integer," +

      " lotLatitude  decimal(10, 8) check (lotLatitude  between  -90 and 90)," +
      " lotLongitude decimal(11, 8) check (lotLongitude between -180 and 180)," +

      " lotTypeStatusId integer," +

      recordColumns + "," +
      " foreign key (lotTypeId) references LotTypes (lotTypeId)," +
      " foreign key (lotContactId) references Contacts (contactId)," +
      " foreign key (lotTypeStatusId) references LotTypeStatuses (lotTypeStatusId)" +
      ")").run();

    lotOccupancyDB.prepare("create table if not exists LotComments (" +
      "lotCommentId integer not null primary key autoincrement," +
      " lotId integer not null," +
      " lotCommentDate integer not null," +
      " lotCommentTime integer not null," +
      " lotComment text not null," +
      recordColumns + "," +
      " foreign key (lotId) references Lots (lotId)" +
      ")").run();

    lotOccupancyDB.close();

    return true;
  }

  return false;
};
