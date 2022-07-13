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

export const initLotOccupancyDB = (): boolean => {

  const lotOccupancyDB = sqlite(databasePath);

  const row = lotOccupancyDB
    .prepare("select name from sqlite_master where type = 'table' and name = 'Lots'")
    .get();

  if (!row) {

    debugSQL("Creating " + databasePath);

    // Lot Types

    lotOccupancyDB.prepare("create table if not exists LotTypes (" +
      "lotTypeId integer not null primary key autoincrement," +
      " lotType varchar(100) not null," +
      " orderNumber smallint not null default 0," +
      recordColumns +
      ")").run();

    lotOccupancyDB.prepare("create index if not exists idx_lottypes_ordernumber" +
      " on LotTypes (orderNumber, lotType)").run();

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

    lotOccupancyDB.prepare("create index if not exists idx_lottypefields_ordernumber" +
    " on LotTypeFields (lotTypeId, orderNumber, lotTypeField)").run();

    lotOccupancyDB.prepare("create table if not exists LotTypeStatuses (" +
      "lotTypeStatusId integer not null primary key autoincrement," +
      " lotTypeId integer not null," +
      " lotTypeStatus varchar(100) not null," +
      " orderNumber smallint not null default 0," +
      recordColumns + "," +
      " foreign key (lotTypeId) references LotTypes (lotTypeId)" +
      ")").run();

    lotOccupancyDB.prepare("create index if not exists idx_lottypestatuses_ordernumber" +
      " on LotTypeStatuses (lotTypeId, orderNumber, lotTypeStatus)").run();

    // Maps and Lots

    lotOccupancyDB.prepare("create table if not exists Maps (" +
      "mapId integer not null primary key autoincrement," +
      " mapName varchar(200) not null," +
      " mapDescription text," +

      " mapLatitude  decimal(10, 8) check (mapLatitude  between  -90 and 90)," +
      " mapLongitude decimal(11, 8) check (mapLongitude between -180 and 180)," +

      " mapSVG varchar(50)," +

      " mapAddress1 varchar(50)," +
      " mapAddress2 varchar(50)," +
      " mapCity varchar(20)," +
      " mapProvince varchar(2)," +
      " mapPostalCode varchar(7)," +
      " mapPhoneNumber varchar(30)," +

      recordColumns +
      ")").run();

    lotOccupancyDB.prepare("create table if not exists Lots (" +
      "lotId integer not null primary key autoincrement," +
      " lotTypeId integer not null," +
      " lotName varchar(100)," +
      " mapId integer," +

      " lotLatitude  decimal(10, 8) check (lotLatitude  between  -90 and 90)," +
      " lotLongitude decimal(11, 8) check (lotLongitude between -180 and 180)," +

      " lotTypeStatusId integer," +

      recordColumns + "," +
      " foreign key (lotTypeId) references LotTypes (lotTypeId)," +
      " foreign key (mapId) references Maps (mapId)," +
      " foreign key (lotTypeStatusId) references LotTypeStatuses (lotTypeStatusId)" +
      ")").run();

    lotOccupancyDB.prepare("create table if not exists LotFields (" +
      "lotId integer not null," +
      " lotTypeFieldId integer not null," +
      " lotFieldValue text not null," +
      recordColumns + "," +
      " primary key (lotId, lotTypeFieldId)," +
      " foreign key (lotId) references Lots (lotId)," +
      " foreign key (lotTypeFieldId) references LotTypeFields (lotTypeFieldId)" +
      ") without rowid").run();

    lotOccupancyDB.prepare("create table if not exists LotComments (" +
      "lotCommentId integer not null primary key autoincrement," +
      " lotId integer not null," +
      " lotCommentDate integer not null check (lotCommentDate > 0)," +
      " lotCommentTime integer not null check (lotCommentTime >= 0)," +
      " lotComment text not null," +
      recordColumns + "," +
      " foreign key (lotId) references Lots (lotId)" +
      ")").run();

    lotOccupancyDB.prepare("create index if not exists idx_lotcomments_datetime" +
      " on LotComments (lotId, lotCommentDate, lotCommentTime)").run();

    // Occupancies
 
    lotOccupancyDB.prepare("create table if not exists Occupants (" +
      "occupantId integer not null primary key autoincrement," +
      " occupantName varchar(200) not null," +
      " occupantAddress1 varchar(50)," +
      " occupantAddress2 varchar(50)," +
      " occupantCity varchar(20)," +
      " occupantProvince varchar(2)," +
      " occupantPostalCode varchar(7)," +
      " occupantPhoneNumber varchar(30)," +
      recordColumns +
    ")").run();

    lotOccupancyDB.prepare("create table if not exists OccupancyTypes (" +
      "occupancyTypeId integer not null primary key autoincrement," +
      " occupancyType varchar(100) not null," +
      " orderNumber smallint not null default 0," +
      recordColumns +
      ")").run();

    lotOccupancyDB.prepare("create index if not exists idx_occupancytypes_ordernumber" +
      " on OccupancyTypes (orderNumber, occupancyType)").run();

    lotOccupancyDB.prepare("create table if not exists OccupancyTypeFields (" +
      "occupancyTypeFieldId integer not null primary key autoincrement," +
      " occupancyTypeId integer not null," +
      " occupancyTypeField varchar(100) not null," +
      " occupancyTypeFieldValues text," +
      " isRequired bit not null default 0," +
      " pattern varchar(100)," +
      " minimumLength smallint not null default 1 check (minimumLength >= 0)," +
      " maximumLength smallint not null default 100 check (maximumLength >= 0)," +
      " orderNumber smallint not null default 0," +
      recordColumns + "," +
      " foreign key (occupancyTypeId) references OccupancyTypes (occupancyTypeId)" +
      ")").run();

    lotOccupancyDB.prepare("create index if not exists idx_occupancytypefields_ordernumber" +
      " on OccupancyTypeFields (occupancyTypeId, orderNumber, occupancyTypeField)").run();

    lotOccupancyDB.prepare("create table if not exists LotOccupancies (" +
      "lotOccupancyId integer not null primary key autoincrement," +
      " occupancyTypeId integer not null," +
      " lotId integer not null," +
      " occupantId integer," +
      " occupancyStartDate integer not null check (occupancyStartDate > 0)," +
      " occupancyEndDate integer check (occupancyEndDate > 0)," +
      recordColumns + "," +
      " foreign key (lotId) references Lots (lotId)," +
      " foreign key (occupantId) references Occupants (occupantId)" +
      ")").run();

    lotOccupancyDB.prepare("create table if not exists LotOccupancyFields (" +
      "lotOccupancyId integer not null," +
      " occupancyTypeFieldId integer not null," +
      " lotOccupancyFieldValue text not null," +
      recordColumns + "," +
      " primary key (lotOccupancyId, occupancyTypeFieldId)," +
      " foreign key (lotOccupancyId) references LotOccupancies (lotOccupancyId)," +
      " foreign key (occupancyTypeFieldId) references OccupancyTypeFields (occupancyTypeFieldId)" +
      ") without rowid").run();

    // Occupancy Fees and Transactions

    lotOccupancyDB.prepare("create table if not exists Fees (" +
      "feeId integer not null primary key autoincrement," +
      " feeName varchar(100) not null," +
      " contactTypeId integer," +
      " contactId integer," +
      " lotTypeId integer," +
      " feeAmount decimal(6, 2)," +
      " feeFunction varchar(100)," +
      " isRequired bit not null default 0," +
      " orderNumber smallint not null default 0," +
      recordColumns + "," +
      " foreign key (contactTypeId) references ContactTypes (contactTypeId)," +
      " foreign key (contactId) references Contacts (contactId)," +
      " foreign key (lotTypeId) references LotTypes (lotTypeId)" +
      ")").run();

    lotOccupancyDB.prepare("create index if not exists idx_fees_ordernumber" +
      " on Fees (orderNumber, feeName)").run();

    lotOccupancyDB.prepare("create table if not exists LotOccupancyFees (" +
      "lotOccupancyId integer not null," +
      " feeId integer not null," +
      " feeAmount decimal(6, 2) not null," +
      recordColumns + "," +
      " primary key (lotOccupancyId, feeId)," +
      " foreign key (lotOccupancyId) references LotOccupancies (lotOccupancyId)," +
      " foreign key (feeId) references Fees (feeId)" +
      ") without rowid").run();

    lotOccupancyDB.prepare("create table if not exists LotOccupancyTransactions (" +
      "lotOccupancyId integer not null," +
      " transactionIndex integer not null," +
      " transactionDate integer not null check (transactionDate > 0)," +
      " transactionTime integer not null check (transactionTime >= 0)," +
      " transactionAmount decimal(6, 2) not null," +
      " externalReceiptNumber varchar(100)," +
      " transactionNote text," +
      recordColumns + "," +
      " primary key (lotOccupancyId, transactionIndex)," +
      " foreign key (lotOccupancyId) references LotOccupancies (lotOccupancyId)" +
      ") without rowid").run();

    lotOccupancyDB.prepare("create index if not exists idx_lotoccupancytransactions_ordernumber" +
      " on LotOccupancyTransactions (lotOccupancyId, transactionDate, transactionTime)").run();

    // Work Orders

    lotOccupancyDB.prepare("create table if not exists WorkOrderTypes (" +
      "workOrderTypeId integer not null primary key autoincrement," +
      " workOrderType varchar(100) not null," +
      " orderNumber smallint not null default 0," +
      recordColumns +
      ")").run();

    lotOccupancyDB.prepare("create index if not exists idx_workordertypes_ordernumber" +
      " on WorkOrderTypes (orderNumber, workOrderType)").run();

    lotOccupancyDB.prepare("create table if not exists WorkOrders (" +
      "workOrderId integer not null primary key autoincrement," +
      " workOrderTypeId integer not null," +
      " workOrderNumber varchar(50) not null," +
      " workOrderDescription text," +
      " workOrderOpenDate integer check (workOrderOpenDate > 0)," +
      " workOrderCloseDate integer check (workOrderCloseDate > 0)," +
      recordColumns + "," +
      " foreign key (workOrderTypeId) references WorkOrderTypes (workOrderTypeId)" +
      ")").run();

    lotOccupancyDB.prepare("create table if not exists WorkOrderLots (" +
      "workOrderId integer not null," +
      " lotId integer not null," +
      recordColumns + "," +
      " primary key (workOrderId, lotId)," +
      " foreign key (workOrderId) references WorkOrders (workOrderId)," +
      " foreign key (lotId) references Lots (lotId)" +
      ") without rowid").run();

    lotOccupancyDB.prepare("create table if not exists WorkOrderComments (" +
      "workOrderCommentId integer not null primary key autoincrement," +
      " workOrderId integer not null," +
      " workOrderCommentDate integer not null check (workOrderCommentDate > 0)," +
      " workOrderCommentTime integer not null check (workOrderCommentTime >= 0)," +
      " workOrderComment text not null," +
      recordColumns + "," +
      " foreign key (workOrderId) references WorkOrders (workOrderId)" +
      ")").run();

    lotOccupancyDB.prepare("create index if not exists idx_workordercomments_datetime" +
      " on WorkOrderComments (workOrderId, workOrderCommentDate, workOrderCommentTime)").run();

    lotOccupancyDB.close();

    return true;
  }

  return false;
};
